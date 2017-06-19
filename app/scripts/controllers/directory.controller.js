angular.module('proyectoBaseAngularJsApp')
  .controller('DirectoryCtrl',['$rootScope','$scope', '$uibModal', function ($rootScope, $scope, $uibModal) {
    
    //private variables
    var vm = this;
    var fire = firebase.database();
    var storageService = firebase.storage();
    vm.directorys = {};
    vm.saveKey = "";
    vm.saveNamePhoto = "";
    vm.isNew = false;
    vm.edit = false;
    vm.directory = {};
    vm.directory.pathPhoto = "";
    vm.directory.urlPhoto = "";


    //public functions 
    vm.openModalDirectory = openModalDirectory;
    vm.createDirectory = createDirectory;
    vm.editDirectory = editDirectory;
    vm.removeDirectory = removeDirectory;
    vm.updateDirectory = updateDirectory;


    //private functions 

    function activate() {
      fire.ref('ihj/directorio').on('value', function(snapshot){
        vm.directorys = snapshot.val();
        $rootScope.$apply();
      });
    }
    activate();

    /* Funcion para abrir modal para crear un nuevo servidor o actualizarlo */
    function openModalDirectory() {
      vm.modalDirectory = $uibModal.open({
          animation: true,
          templateUrl: 'views/modals/directory.modal.html',
          scope: $scope,
          size: 'news',
          backdrop: 'static'
        });
    }

    /* Funcion para crear un nuevo servidor */
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
            vm.isNew = false;
            vm.directory = {};
          });
      }); 
    }


    /* Funcion para eliminar una servidor */
    function removeDirectory( key, namePhoto ) {
      swal({
        title: '¿Esta  seguro?',
        text: "¡El servidor sera eliminado permanentemente!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
      }).then(function () {
        firebase.storage().ref().child('directorio' + '/' + namePhoto).delete().then(function() {
          // File deleted successfully
          firebase.database().ref('ihj/directorio/' + key).remove().then(function(){
            swal('¡Servidor Eliminado!', 'El servidor ha sido eliminado satisfactoriamente!', 'success');
          });   
        }).catch(function(error) {
          // Uh-oh, an error occurred!
            swal( 'Error!', 'No se pudo eliminar el servidor!', 'error');
        });
      });
    }

    /* Obtener los datos del servidor a actualizar y mostrarlos en el modal */
    function editDirectory( key ) {
      var servidor = _.find(vm.directorys, function(item){ return item.$key == key});
      vm.saveKey = servidor.$key;
      vm.saveNamePhoto = servidor.nombreFoto;
      vm.directory.fullName = servidor.nombre;
      vm.directory.position = servidor.cargo;
      vm.directory.email = servidor.correo;
      vm.directory.pathPhoto = servidor.rutaFoto;
      openModalDirectory();
    }
    
    /* Funcion para actualizar a un servidor */
    function updateDirectory( name, position, email, photo ) {
      swal({
        title: '¿Estas  seguro?',
        text: "¡Los datos del servidor seran actualizados!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
      }).then(function () {
        if (photo == "" || photo == null) {
          fire.ref('ihj/directorio/' + vm.saveKey).update({
            'nombre': name,
            'cargo': position,
            'correo': email
          }).then(function(){
            vm.modalDirectory.dismiss();
            swal("¡Noticia Actualizada!", "La noticia se ha actualizado satisfactoriamente", "success");
            vm.directory = {};
            vm.edit = false;
          });
        }
        else{
          openModalLoader();
          /* Primero eliminamos la foto que tenia anteriormente la noticia */
          firebase.storage().ref().child('directorio' + '/' + vm.saveNamePhoto).delete().then(function() {
            /* Posteriormente creamos la referencia de la nueva imagen y la subimos al storage */
            var refStorage = storageService.ref('directorio').child(photo.name);
            var uploadTask = refStorage.put(photo);
            uploadTask.on('state_changed', function(snapshot){
              /* Aqui se puede monitorear la carga de la imagen */
            }, function(error) {
              vm.modalLoader.dismiss();
              swal("¡Error al cargar!", "Hubo un problema al cargar la nueva imagen", "error");
            }, function() {
                var downloadURL = uploadTask.snapshot.downloadURL;
                fire.ref('ihj/directorio/' + vm.saveKey).update({
                  'nombre': name,
                  'cargo': position,
                  'correo': email,
                  'rutaFoto': downloadURL,
                  'nombreFoto': photo.name
                }).then(function(){
                  vm.modalLoader.dismiss();
                  vm.modalDirectory.dismiss();
                  swal("Servidor Actualizado!", "El servidor ha sido actualizado satisfactoriamente", "success");     
                  vm.directory = {};
                  vm.edit = false;
                });
            }); 
          }).catch(function(error) {
            vm.modalLoader.dismiss();
            swal('Error!', 'No se pudo actualizar la imagen del servidor!', 'error');
          });
        }
      });    
    }

    /* Abrir un loading cuando se esta realizado un proceso */
    function openModalLoader() {
      vm.modalLoader = $uibModal.open({
          animation: true,
          templateUrl: 'views/modals/loader.modal.html',
          scope: $scope,
          size: 'loader',
          backdrop: 'static'
        });
    }
    
  }]);




  