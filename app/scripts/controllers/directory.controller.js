angular.module('proyectoBaseAngularJsApp')
  .controller('DirectoryCtrl',['$rootScope','$scope', '$uibModal', function ($rootScope, $scope, $uibModal) {
    
    //private variables
    var vm = this;
    var fire = firebase.database();
    var storageService = firebase.storage();
    vm.directory = {};


    //public functions 
    vm.openModalDirectory = openModalDirectory;
    vm.createDirectory = createDirectory;


    //private functions 

    function activate() {
      fire.ref('ihj/directorio').on('value', function(snapshot){
        vm.directory = snapshot.val();
        $rootScope.$apply();
      });
    }
    activate();

    function openModalDirectory() {
      vm.modalDirectory = $uibModal.open({
          animation: true,
          templateUrl: 'views/modals/directory.modal.html',
          scope: $scope,
          size: 'news',
          backdrop: 'static'
        });
    }

    function createDirectory( fullName, position, email, photo) {
      var refStorage = storageService.ref('directorio').child(photo.name);
      var uploadTask = refStorage.put(photo);
      uploadTask.on('state_changed', function(snapshot){
        //aqui se puede monitorear la carga de la imagen
      }, function(error) {
          swal("¡Error al cargar!", "Hay un problema con la carga de la imagen", "error");
      }, function() {
          var downloadURL = uploadTask.snapshot.downloadURL;
          fire.ref('ihj/directorio').push({
            'nombre': fullName,
            'cargo': position,
            'correo': email,
            'rutaFoto': downloadURL,
            'nombreFoto': photo.name
          }).then(function(){
            swal("¡Servidor Creado!", "El servidor publico se ha registrado satisfactoriamente", "success");
            vm.modalDirectory.dismiss();
          });
      }); 
    }
    
  }]);




  