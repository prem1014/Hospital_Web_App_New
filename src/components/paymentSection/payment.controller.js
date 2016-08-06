(function(){
	'use strict';
	angular.module('app.payment',[])
	.controller('PaymentCtrl',paymentCtrl);

	paymentCtrl.$inject=['$scope', '$http', 'PaymentService', 'PatientService'];

	function paymentCtrl($scope, $http, PaymentService, PatientService){
        $scope.female = false;
        $scope.male = false;
        $scope.isDisabled = true;
        $scope.isUpdateDisabled = true;
        $scope.isDeleteDisabled = true;
        $scope.isAddPatientDisabled = false;

        $scope.format = 'dd - MM - yyyy';

        $scope.search = function (event) {
            if (event.which == 13) {
                if (!$scope.searchForm.$valid) {
                    $scope.srchFrmSubmitted = true;
                }
                else if ($scope.searchForm.$valid) {
                    $scope.isLoading = true;
                    var Pid = $scope.searchItem;
                    if (Pid.charAt(4) === 'C') {
                        var responseReceipt = PaymentService.getPaymentDetails(Pid);

                        responseReceipt.success(function (data, status, headers, config) {
                            getPaymentData(data);

                            var response = PatientService.getPatientDataById(data.PatientID);

                            response.success(function (data, status, headers, config) {
                                setData(data);
                                $scope.isLoading = false;
                                // $scope.isDisabled = false;
                                $scope.isUpdateDisabled = false;
                                $scope.isDeleteDisabled = false;
                                $scope.isAddPatientDisabled = true;
                            })
                            response.error(function (data, status, headers, config) {
                                swal('No records found');
                            });

                            var res = PaymentService.getPatientBalanceAmount(data.PatientID);
                            res.success(function (data, status, headers, config) {
                                $scope.balanceAmount = data.Balance;
                                $scope.isLoading = false;
                                // $scope.isDisabled = false;
                                $scope.isUpdateDisabled = false;
                                $scope.isDeleteDisabled = false;
                                $scope.isAddPatientDisabled = true;
                            })
                            res.error(function (data, status, headers, config) {
                                swal('No records found');
                            });

                        })
                        responseReceipt.error(function (data, status, headers, config) {
                            swal('No records found');
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

                        var res = PaymentService.getPatientBalanceAmount(Pid);
                        res.success(function (data, status, headers, config) {
                            $scope.balanceAmount = data.Balance;
                        })
                        res.error(function (data, status, headers, config) {
                            swal('No records found');
                        });
                    }
                }
            }
        }

        $scope.GetAmountDue = function () {
            $scope.amountDue = $scope.balanceAmount - $scope.payNow;
        }
        $scope.addNewPayment = function () {
            if(!$scope.paymentForm.$valid){
                $scope.submitted=true;
            }
            else if($scope.paymentForm.$valid){
                var response = PaymentService.addNewPayment(setPaymentData());
                response.success(function (data, status, headers, config) {
                    swal('Payment Received successfully');
                    $scope.recieptNo = data;
                    $scope.isDisabled = false;
                });
                response.error(function (data, status, headers, config) {
                });
            }
        };

        $scope.printData = function () {
            $scope.pritableData = [];
            var dt = $scope.dt.getDate() + '-' + ($scope.dt.getMonth() + 1) + '-' + $scope.dt.getFullYear();
            var patientType = $scope.patientType == 1 ? 'OPD' : 'IPD';
            var sex = $scope.sex == 'F' ? 'Female' : 'Male';

            $scope.pritableData.push({ field: 'Patient Id', value: $scope.patientId, field1: 'Payment Date', value1: dt },
                { field: 'Patient Name', value: $scope.patientName, field1: 'Age/Sex', value1: $scope.age + ', ' + sex },
                { field: 'Attendant Name', value: $scope.attendantName, field1: 'Contact Number', value1: $scope.contactNo },
                { field: 'Address', value: $scope.address, field1: 'Type', value1: patientType },
                { field: 'Remarks', value: $scope.remarks, field1: 'Payment Amount', value1: $scope.payNow }
                );
            $scope.$broadcast('printData', [$scope.pritableData, false, 'Payment Receipt']);
            $scope.isAddPatientDisabled = true;
        };

        $scope.$on('refreshDate', function () {
            // $timeout(function () {
            refreshForm();
            $scope.isAddPatientDisabled = false;
            $scope.isDeleteDisabled = true;
            $scope.isUpdateDisabled = true;
            $scope.isDisabled = true;
            // }, 0)
        });

        $scope.deletePayment = function () {
            swal({
                title: "Are you sure?",
                text: "Payment data will be deleted!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false,
                html: false
            }, function () {
                var ajaxResponse = PaymentService.deletePaymentById($scope.recieptNo);
                ajaxResponse.success(function (data, status, headers, config) {
                    swal('Payment Details Deleted successfully');
                    $scope.refreshData();
                })
                ajaxResponse.error(function (data, status, headers, config) {
                    swal('Some thing is wrong with server, please try again');
                });
            });
        }

        $scope.updatePayment = function () {
            var response = PaymentService.updatePayment(setPaymentData());
            response.success(function (data, status, headers, config) {
                swal('Payment Details Modified successfully');
                $scope.isAddPatientDisabled = true;
                $scope.isDisabled = false;
            });
            response.error(function (data, status, headers, config) {
                swal('No records found');
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

        $scope.refreshData = function () {
            refreshForm();
            $scope.isAddPatientDisabled = false;
            $scope.isUpdateDisabled = true;
            $scope.isDeleteDisabled = true;
            $scope.isDisabled = true;
        };

        function setData(response) {
            if (response) {
                $scope.patientId = response.PatientID;
                $scope.patientName = response.Name;
                $scope.age = response.Age;
                $scope.attendantName = response.AttendentName;
                $scope.address = response.Address;
                $scope.contactNo = response.ContactNumber1;
                var paymentDate = new Date(response.paymentDate);
                paymentDate = paymentDate.getDay() + '-' + (paymentDate.getMonth() + 1) + '-' + paymentDate.getFullYear();
                $scope.paymentDate = new Date(paymentDate);

                $scope.sex = response.Sex;

                if (response.TypeID === 1)
                    $scope.patientType = "OPD";
                else
                    $scope.patientType = "IPD";

            }
            else {
                alert('Some thing was wrong');
            }
        }


        function getPaymentData(response) {
            if (response) {
                $scope.patientId = response.PatientID;
                $scope.remarks = response.Remarks;
                $scope.recieptNo = response.PaymentReceiptNo;
                $scope.payNow = response.Amount;
            }
            else {
                alert('Some thing was wrong');
            }
        };

        function setPaymentData() {
            var paymentData = {};
            paymentData.PaymentReceiptNo = $scope.recieptNo;
            paymentData.PatientID = $scope.patientId;
            paymentData.Amount = $scope.payNow;
            paymentData.PaymentMode = "C";
            paymentData.PaymentDate = $scope.dt;
            paymentData.Remarks = $scope.remarks;

            return paymentData;
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
            $scope.amountDue = '';
            $scope.balanceAmount = '';
            $scope.remarks = '';
            $scope.recieptNo = '';

        };

        function isArray(x) {
            return x.constructor.toString().indexOf("Array") > -1;
        }
		
	}
})();