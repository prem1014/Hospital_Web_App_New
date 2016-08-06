(function(){
	angular.module('app.patientRegistration',[])
	.controller('PatientRegiCtrl',patientRegiCtrl);

	patientRegiCtrl.$inject=['$scope', '$timeout', 'PatientService'];

	function patientRegiCtrl($scope,$timeout, PatientService){
        $scope.female = true;
        $scope.male = false;
        $scope.isDisabled = true;
        $scope.isUpdateDisabled = true;
        $scope.isDeleteDisabled = true;
        $scope.isAddPatientDisabled = false;
        getReferedByList();
        getDeparmentList();
        getPatientTypeList();

        $scope.search = function (event) {
            if (event.which == 13) {
                if (!$scope.searchForm.$valid) {
                    $scope.srchFrmSubmitted = true;
                }
                else if ($scope.searchForm.$valid) {
                    $scope.isLoading = true;
                    var response = PatientService.getPatientDataById($scope.searchItem);
                    response.success(function (data, status, headers, config) {
                        setData(data);
                        $scope.isLoading = false;
                       // $scope.isDisabled = false;
                        $scope.isUpdateDisabled = false;
                        $scope.isDeleteDisabled = false;
                        $scope.isAddPatientDisabled = true;
                    })
                    response.error(function (data, status, headers, config) {
                       // alert('No records found for this patient');
                        swal("No records found for this patient!");
                    });
                }
            }
        }

        $scope.addNewPatient = function () {

            if (!$scope.patientDeatilsForm.$valid) {
                $scope.submitted = true;
            }
            else if ($scope.patientDeatilsForm.$valid) {
                var response = PatientService.addNewPatient(setPatientData());
                response.success(function (data, status, headers, config) {
                    $scope.patientId = data;
                    swal('Patient Registered Successfully');
                    $scope.isDisabled = false;
                   // $scope.isAddPatientDisabled = true;
                    // refreshForm();
                });
                response.error(function (data, status, headers, config) {

                });
            }
        };

        $scope.deletePatient = function () {
            swal({
                title: "Are you sure?",
                text: "Patient data will be deleted!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false,
                html: false
            }, function () {
                 var ajaxResponse = PatientService.deletePatientById($scope.patientId);
                 ajaxResponse.success(function (data, status, headers, config) {
                     swal('Patient Deleted');
                     $scope.refreshData();
                 })
                 ajaxResponse.error(function (data, status, headers, config) {
                     swal('Some thing is worng with server, please try again');
                 });
            });

        }

        $scope.updatePatient = function () {
            var response = PatientService.updatePatient(setPatientData());
            response.success(function (data, status, headers, config) {
                swal('Patient Details Modified successfully');
                $scope.isAddPatientDisabled = true;
                $scope.isDisabled = false;
            });
            response.error(function (data, status, headers, config) {

            });
        };

        $scope.printData = function () {
            $scope.pritableData = [];
            var dt = $scope.dt.getDate() + '-' + ($scope.dt.getMonth() + 1) + '-' + $scope.dt.getFullYear();
            var patientType = $scope.patientType == 1 ? 'OPD' : 'IPD';
            var sex = $scope.sex == 'F' ? 'Female' : 'Male';

            $scope.pritableData.push({ field: 'Patient Id', value: $scope.patientId, field1: 'Payment Date', value1: dt },
                { field: 'Patient Name', value: $scope.patientName, field1: 'Age/Sex', value1: $scope.age + ', ' + sex },
                { field: 'Attendant Name', value: $scope.attendantName, field1: 'Contact Number', value1: $scope.contactNo },
                { field: 'Address', value: $scope.address, field1: 'Type', value1:patientType },
                { field: 'Remarks', value: $scope.remarks, field1: 'Reg. Fee', value1: $scope.consultantFee }
                );
            $scope.$broadcast('printData', [$scope.pritableData, false, 'Patient Registration']);
            //refreshForm();
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
        //$filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss Z');

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
        $scope.formats = 'dd - MM - yyyy';

        $scope.sex = "F";

        $scope.refreshData = function () {
            refreshForm();
            $scope.isAddPatientDisabled = false;
            $scope.isUpdateDisabled = true;
            $scope.isDeleteDisabled = true;
            $scope.isDisabled = true;
        };

        function getReferedByList() {
            var ajaxResponse = PatientService.getReferedByList();
            ajaxResponse.success(function (data, status, headers, config) {
                $scope.referedByList = data;
                $scope.drName = $scope.referedByList[0].ID;
            })
            ajaxResponse.error(function (data, status, headers, config) {
                alert(status.Message);
            });
        };

        function getDeparmentList() {
            var ajaxResponse = PatientService.getDeparmentList();
            ajaxResponse.success(function (data, status, headers, config) {
                $scope.depName = data[0].ID;
                $scope.departmentList = data;

            })
            ajaxResponse.error(function (data, status, headers, config) {
                alert(status.Message);
            });
        };

        function getPatientTypeList() {
            var ajaxResponse = PatientService.getPatientTypeList();
            ajaxResponse.success(function (data, status, headers, config) {
                $scope.patientType = data[0].ID;
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
                $scope.email = response.Email;
                $scope.consultantName = response.ConsultantName;
                $scope.Department = response.DepartmentID;
                $scope.consultantFee = response.ConsultantFee;
                $scope.remarks = response.Remarks;
                var dateOfAdmit = new Date(response.RegDate);
                dateOfAdmit = dateOfAdmit.getFullYear() + '-' + (dateOfAdmit.getMonth() + 1) + '-' + dateOfAdmit.getDate();
                $scope.dt = new Date(dateOfAdmit);
                $scope.sex = response.Sex;
                if ($scope.referedByList) {
                    var len = $scope.referedByList.length;
                    for (var i = 0; i < len; i++) {
                        if ($scope.referedByList[i].ID === response.RefByID) {
                            $scope.drName = $scope.referedByList[i].ID;
                            break;
                        }
                    }
                }
                if ($scope.patientTypeList) {
                    var len = $scope.patientTypeList.length;
                    for (var i = 0; i < len; i++) {
                        if ($scope.patientTypeList[i].ID === response.TypeID) {
                            $scope.patientType = $scope.patientTypeList[i].ID;
                            break;
                        }
                    }
                }
            }
            else {
                alert('Some thing was wrong');
            }
        }

        function setPatientData() {
            var patientData = {};
            patientData.PatientID = $scope.patientId;
            patientData.Name = $scope.patientName;
            patientData.Age = $scope.age;
            patientData.AttendentName = $scope.attendantName;
            patientData.Address = $scope.address;
            patientData.ContactNumber1 = $scope.contactNo;
            patientData.Email = $scope.email;
            patientData.ConsultantName = $scope.consultantName;
            patientData.DepartmentID = $scope.department;
            patientData.ConsultantFee = $scope.consultantFee;
            patientData.Remarks = $scope.remarks;
            patientData.RegDate = $scope.dt;
            patientData.Sex = $scope.sex;

            if ($scope.patientType) {
                //var len = $scope.patientTypeList.length;
                if (typeof ($scope.patientType) === "object") {
                    patientData.TypeID = $scope.patientType.ID;
                }
                else {
                    patientData.TypeID = $scope.patientType
                }
            }
            if (typeof ($scope.depName) === "object") {
                patientData.DepartmentID = $scope.depName.ID;
            }
            else {
                patientData.DepartmentID = $scope.depName
            }
            if (typeof ($scope.drName) === "object") {
                patientData.RefByID = $scope.drName.ID;
            }
            else {
                patientData.RefByID = $scope.drName
            }

            return patientData;
        }

        function refreshForm() {
            $scope.patientId = '';
            $scope.patientName = '';
            $scope.age = '';
            $scope.attendantName = '';
            $scope.address = '';
            $scope.contactNo = '';
            $scope.email = '';
            // $scope.sex = '';
            $scope.consultantName = '';
            $scope.consultantFee = '';
            $scope.remarks = '';
            $scope.drName = $scope.referedByList[0].ID;
            $scope.depName = $scope.departmentList[0].ID;
            $scope.patientType = $scope.patientTypeList[0].ID;
            //  $scope.patientDeatilsForm.$setPristine();
            $scope.IsDivPrint = false;
        };

        function isArray(x) {
            return x.constructor.toString().indexOf("Array") > -1;
        }
	}
})();