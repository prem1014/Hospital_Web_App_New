(function(){
	'use strict';
	angular.module('app.bill',[])
	.controller('BillCtrl',billCtrl);

	billCtrl.$inject=['$scope', '$rootScope', '$http','$timeout', 'BillService', 'PatientService'];

	function billCtrl($scope, $rootScope, $http,$timeout, BillService, PatientService){
        $scope.female = false;
        $scope.male = false;
        $scope.isDisabled = true;
        $scope.isUpdateDisabled = true;
        $scope.isDeleteDisabled = true;
        $scope.isAddPatientDisabled = false;

        $scope.format = 'dd - MM - yyyy';
        $rootScope.billItems = [];
        $scope.listOfHeaders = [{ field: 'Lab', col: 'lab' }, { field: 'Description', col: 'desc' }, { field: 'Quantity', col: 'quantity' }, { field: 'Rate', col: 'rate' }, { field: 'Amount', col: 'amount' }, { field: 'Discount', col: 'discount' }, { field: 'Net Amount', col: 'netAmount' }
            , { field: '', col: 'edit' }, { field: '', col: 'delete' }];

        getBillItem();
        getLabList();
       
        $scope.addBillItem = function () {
            
           // if (!$scope.billForm.$valid) {
           //     $scope.billItemFrmSubmitted = true;
           // }
           // else if ($scope.billForm.$valid) {
                if ($scope.discount!==undefined){
                    $rootScope.billItems.push({
                        id: $rootScope.billItems.length, itemCode: $scope.chargeName, labCode: $scope.labName,
                        lab: getTestLabName(), desc: getBillDescription(), quantity: $scope.quantity, rate: $scope.rate,
                        discount: $scope.discount, amount: $scope.rate * $scope.quantity, netAmount: $scope.rate * $scope.quantity - $scope.discount
                    })
                }
                else {
                    $scope.discount = 0;
                    $rootScope.billItems.push({
                        id: $rootScope.billItems.length, itemCode: $scope.chargeName, labCode: $scope.labName,
                        lab: getTestLabName(), desc: getBillDescription(), quantity: $scope.quantity, rate: $scope.rate,
                        discount: $scope.discount, amount: $scope.rate * $scope.quantity, netAmount: $scope.rate * $scope.quantity - $scope.discount
                    })
               }
                if ($scope.totalAmount === undefined) {
                    $scope.totalAmount = 0;
                    $scope.totalAmount += $scope.rate * $scope.quantity - $scope.discount;
                }
                else {
                    $scope.totalAmount += $scope.rate * $scope.quantity - $scope.discount;
                }
           // }
        };

        $scope.search = function (event) {
            if (event.which == 13) {
                if (!$scope.searchForm.$valid) {
                    $scope.submitted = true;
                }
                else if ($scope.searchForm.$valid) {
                    $scope.isLoading = true;
                    $rootScope.billItems.splice(0, $rootScope.billItems.length);
                    var Pid = $scope.searchItem;
                    if (Pid.charAt(4) === 'B') {
                        var responseBillDetails = BillService.getBillDetails(Pid);

                        responseBillDetails.success(function (data, status, headers, config) {
                            getBillData(data);
                            $scope.isUpdateDisabled = false;
                            $scope.isDeleteDisabled = false;
                            $scope.isAddPatientDisabled = true;

                            var response = PatientService.getPatientDataById(data.PatientID);

                            response.success(function (data, status, headers, config) {
                                setData(data);
                                $scope.isLoading = false;
                            })
                            response.error(function (data, status, headers, config) {
                                swal('No records found');
                            });
                        })
                        responseBillDetails.error(function (data, status, headers, config) {

                            swal('No records found');
                            $scope.isLoading = false;
                        });
                    }
                    else {
                        var response = PatientService.getPatientDataById(Pid);
                        $scope.isLoading = false;

                        response.success(function (data, status, headers, config) {
                            setData(data);
                            $scope.isLoading = false;
                        })
                        response.error(function (data, status, headers, config) {
                            swal('No records found');
                        });
                    }
                }
            }
        }

        function getChargeList() {
            var ajaxResponse = BillService.getChargeList();
            ajaxResponse.success(function (data, status, headers, config) {
                $scope.chargeName = data[0].Code;
                $scope.chargeList = data;
            })
            ajaxResponse.error(function (data, status, headers, config) {
                alert(status.Message);
            });
        };

        function getLabList() {
            var ajaxResponse = BillService.getLabList();
            ajaxResponse.success(function (data, status, headers, config) {
                $scope.labName = data[0].Code;
                $scope.labList = data;
            })
            ajaxResponse.error(function (data, status, headers, config) {
                alert(status.Message);
            });
        };


        $scope.GetBillTotal = function () {
            $scope.totalAmount = ($scope.rate * $scope.quantity) - $scope.discount;
        }

        $scope.searchBill = function (event) {
            if (event.which == 13) {
                if (!$scope.form1.$valid) {
                    $scope.submitted = true;
                }
                else if ($scope.form1.$valid) {
                    $scope.isLoading = true;
                    var response = BillService.getPatientBill($scope.billNo);
                    response.success(function (data, status, headers, config) {
                        setData(data);
                        $scope.isLoading = false;
                    })
                    response.error(function (data, status, headers, config) {
                        alert(status.Message);
                    });
                }
            }
        }

        $scope.addNewBill = function () {
            if (!$scope.billForm.$valid) {
                $scope.billFrmSubmitted = true;
            }
            else if ($scope.billForm.$valid) {
                var response = BillService.addNewBill(setBillData());
                response.success(function (data, status, headers, config) {
                    $scope.billNo = data;
                    swal('Bill Added and receipt no is :' + data);
                    $scope.isDisabled = false;
                });
                response.error(function (data, status, headers, config) {
                    swal('Some thing is worng with server, please try again');
                });
            }
        };

        $scope.deleteBill = function () {
            swal({
                title: "Are you sure?",
                text: "Current bill will be deleted!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false,
                html: false
            }, function () {
                var ajaxResponse = BillService.deleteBill($scope.billNo);
                ajaxResponse.success(function (data, status, headers, config) {
                    swal('Bill Data deleted');
                    $scope.refreshData();
                })
                ajaxResponse.error(function (data, status, headers, config) {
                    swal('Some thing is worng with server, please try again');
                });
            });

        }

        $scope.updateBill = function () {
            var response = BillService.updateBill(setBillData());
            response.success(function (data, status, headers, config) {
                swal('Bill Data Modified successfully');
                $scope.isAddPatientDisabled = true;
                $scope.isDisabled = false;
            });
            response.error(function (data, status, headers, config) {

            });
        };

        $scope.today = function () {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.popup = {
            opened: false
        };
        $scope.openDatePickerPopup = function () {
            $scope.popup.opened = true;
        };

        $scope.getRate = function () {

            var len = $scope.chargeList.length;
            for (var i = 0; i < len;i++){
                if ($scope.chargeList[i].Code === $scope.chargeName) {
                    $scope.rate = $scope.chargeList[i].Rate;
                    break;
                }
            }

        };

        $scope.printData = function () {
            $scope.pritableData = [];
            var dt = $scope.dt.getDate() + '-' + ($scope.dt.getMonth() + 1) + '-' + $scope.dt.getFullYear();
            var sex = $scope.sex == 'F' ? 'Female' : 'Male';

            $scope.pritableData.push({ field: 'Patient Id', value: $scope.patientId,field1: 'Payment Date', value1:dt },
                { field: 'Patient Name', value: $scope.patientName,field1: 'Age/Sex', value1: $scope.age + ', ' + sex  },
                {field:'Attendant Name',value:$scope.attendantName,field1:'Contact Number',value1:$scope.contactNo},
                { field: 'Bill Number', value: $scope.billNo, field1: 'Type', value1: $scope.patientType },
                { field: 'Total Amount', value: $scope.totalAmount,field1: 'Amount Paid', value1: $scope.payNow  },
                { field: 'Amount Due', value: $scope.totalAmount - $scope.payNow }
                );
            $scope.$broadcast('printData', [$scope.pritableData,true,'Bill Receipt']);
            $scope.isAddPatientDisabled = true;
        }

        $scope.$on('refreshDate', function () {
            // $timeout(function () {
            refreshForm();
            $scope.isAddPatientDisabled = false;
            $scope.isDeleteDisabled = true;
            $scope.isUpdateDisabled = true;
            $scope.isDisabled = true;
            // }, 0)
        });

       /* $scope.$on('printData', function () {
            $scope.pritableData = [];
            $timeout(function () {
                $scope.receiptType = 'Bill Receipt';
                console.log("update time clicked");
                $scope.pritableData.push({ field: 'Patient Id', value: $scope.patientId }, { field: 'Payment Date', value: $scope.dt },
                { field: 'Patient Name', value: $scope.patientName }, { field: 'Age/Sex', value: $scope.age + ',' + $scope.sex },
                { field: 'Attendant Name', value: $scope.attendantName }, { field: 'Contact Number', value: $scope.contactNo },
                { field: 'Reciept Number', value: $scope.recieptNo }, { field: 'Type', value: $scope.patientType },
                { field: 'Amount Paid', value: $scope.payNow }, { field: 'Amount Due', value: $scope.amountDue }
                );
            }, 0);
           // $scope.$apply(function () {

           // });

        });*/

        $scope.refreshData = function () {
            refreshForm();
            $scope.isAddPatientDisabled = false;
            $scope.isUpdateDisabled = true;
            $scope.isDeleteDisabled = true;
            $scope.isDisabled = true;
        };

        $scope.$on('billItemsChanged', function (event, index) {
            if (index[1]=='-') {
                $scope.totalAmount -= $rootScope.billItems[index[0]].netAmount;
                $rootScope.billItems.splice(index[0], 1);
                for (var i = 0; i < $rootScope.billItems.length; i++) {
                    $rootScope.billItems[i].id = i+1;
                }
            }
            else if (index[1] == '+') {
                $scope.totalAmount = 0;
                for (var i = 0; i < $rootScope.billItems.length;i++){
                    $scope.totalAmount += $rootScope.billItems[i].netAmount;
                }
            }
        });

        function getBillDescription(itemcode){
            var len = $scope.chargeList.length;
            var description = '';
            if (itemcode !== undefined) {
                for (var i = 0; i < len; i++) {
                    if ($scope.chargeList[i].Code === itemcode) {
                        description = $scope.chargeList[i].Description;
                        break;
                    }
                }
            }
            else {
                for (var i = 0; i < len; i++) {
                    if ($scope.chargeList[i].Code === $scope.chargeName) {
                        description = $scope.chargeList[i].Description;
                        break;
                    }
                }
            }
            return description;
        };

        function getTestLabName(labcode) {
            var len = $scope.labList.length;
            var labName = '';
            if(labcode!=undefined){
                for (var i = 0; i < len; i++) {
                    if ($scope.labList[i].Code === labcode) {
                        labName = $scope.labList[i].Name;
                        break;
                    }
                }
            }
        else{
            for (var i = 0; i < len; i++) {
                if ($scope.labList[i].Code === $scope.labName) {
                    labName = $scope.labList[i].Name;
                    break;
                }
            }
        }
            return labName;
        };

        function getPatientTypeList() {
            var ajaxResponse = BillService.getPatientTypeList();
            ajaxResponse.success(function (data, status, headers, config) {
                $scope.patientType = data[0];
                $scope.patientTypeList = data;

            })
            ajaxResponse.error(function (data, status, headers, config) {
                alert(status.Message);
            });
        };

        function setData(response) {
            if (response) {
                $scope.patientId = response.PatientID;
                $scope.patientName = response.Name;
                $scope.age = response.Age;
                $scope.attendantName = response.AttendentName;
                $scope.address = response.Address;
                $scope.contactNo = response.ContactNumber1;
                $scope.sex = response.Sex;
                $scope.quantity = 1;
                var billDate = new Date(response.BillDate);
                billDate = billDate.getFullYear() + '-' + (billDate.getMonth() + 1) + '-' + billDate.getDay();
                $scope.billDate = new Date(billDate);
                /* if (response.ItemCode===0) {
                     $scope.chargeName =1;
                 }
                else{
                 $scope.chargeName = response.ItemCode;
                 }
                 if (response.LabCode === 0) {
                     $scope.labName = 1;
                 }
                 else {
                     $scope.labName = response.LabCode;
                 }*/
               
                if (response.TypeID === 1)
                    $scope.patientType = "OPD";
                else
                    $scope.patientType = "IPD";

            }
            else {
                alert('Some thing was wrong');
            }
        }

        function setBillData() {
            var billData = {};
            billData.PatientID = $scope.patientId;
            billData.BillNo = $scope.billNo;
            billData.AmountPaid = $scope.payNow;
            billData.BillTotal = $scope.totalAmount;
            billData.BillDate = $scope.dt;
            billData.Remarks = $scope.remarks;
            billData.PaymentMode = "C";

            var billDetails = {};

            billDetails.ItemCode = $scope.chargeName
            billDetails.LabCode = $scope.labName;
            billDetails.Rate = $scope.rate;
            billDetails.Quantity = $scope.quantity;
            billDetails.Amount = $scope.rate * $scope.quantity;
            billDetails.Discount = $scope.discount;
            billDetails.NetAmount = billDetails.Amount - billDetails.Discount;
            // billDetails = JSON.stringify(billDetails);

            billData.BillDetails = $rootScope.billItems;
            return billData;
        }

        function getBillData(response) {
            if (response) {
                $scope.patientId = response.PatientID;
                // $scope.remarks = response.Remarks;
                $scope.billNo = response.BillNo;
                $scope.payNow = response.AmountPaid;
                $scope.totalAmount = response.BillTotal;
                $scope.billDate = response.BillDate;
               // $scope.rate = response.BillDetails[0].Rate;
                $scope.quantity = response.BillDetails.Quantity;
                $scope.discount = response.BillDetails.Discount;
                $scope.remarks = response.Remarks;
                /*if ($scope.chargeList) {
                    var len = $scope.chargeList.length;
                   for (var i = 0; i < len; i++) {
                        if ($scope.chargeList[i].Code ===response.BillDetails.ItemCode) {
                            $scope.chargeName = $scope.chargeList[i].Code;
                            break;
                        }
                    }
                }
                $scope.labName = response.BillDetails.LabCode;*/
                var len = response.BillDetails.length;
                $rootScope.billItems.splice(0, $rootScope.billItems.length);
                for (var i = 0; i < len;i++){
                    $rootScope.billItems.push({
                        id: $rootScope.billItems.length, itemCode: response.BillDetails[i].ItemCode, labCode: response.BillDetails[i].LabCode,
                        lab: getTestLabName(response.BillDetails[i].LabCode), desc: getBillDescription(response.BillDetails[i].ItemCode), quantity: response.BillDetails[i].Quantity, rate: response.BillDetails[i].Rate,
                    discount: response.BillDetails[i].Discount, amount: response.BillDetails[i].Amount, netAmount: response.BillDetails[i].NetAmount
                })
                }
        }

    else {
                alert('Some thing was wrong');
    }
};

        function getBillItem() {
    var response = BillService.getChargeList();
    response.success(function (data, status, headers, config) {
        $scope.chargeName = data[0].Code;
        $scope.chargeList = data;
        $scope.rate = data[0].Rate;
    })
    response.error(function (data, status, headers, config) {
        alert('Please start web api server');
    });
};

        function refreshForm() {
            $scope.patientId = '';
            $scope.patientName = '';
            $scope.age = '';
            $scope.attendantName = '';
            $scope.address = '';
            $scope.contactNo = '';
            $scope.sex = '';
            $scope.patientType = '';
            $scope.payNow = '';
            $scope.totalAmount = '';
            $scope.billNo = '';
            $scope.billItems.splice(0, $scope.billItems.length);
            $scope.remarks = '';
        };

        function isArray(x) {
    return x.constructor.toString().indexOf("Array") > -1;
}
		
	}
})();