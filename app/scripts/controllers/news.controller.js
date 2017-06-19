angular.module('proyectoBaseAngularJsApp')
  .controller('NewsCtrl',['$rootScope','$scope', '$uibModal', '$window', function ($rootScope, $scope, $uibModal, $window) {
    
    //private variables
    var vm = this;
    var fire = firebase.database();
    var storageService = firebase.storage();
    vm.news = {};
    vm.new = {};
    vm.activateLoader = false;
    vm.new.urlPhoto = "";
    vm.edit = false;
    vm.isNew = false;
    vm.new.pathPhoto = "";


    //public functions 
    vm.openModalNews = openModalNews;
    vm.createNews = createNews;
    vm.seePhoto = seePhoto;
    vm.removeNews = removeNews;
    vm.openModalLoader = openModalLoader;
    vm.updateNews = updateNews;
    vm.editNews = editNews;


    //private functions 
    function activate() {
      fire.ref('ihj/noticias').on('value', function(snapshot){
        vm.news = snapshot.val();
        $rootScope.$apply();
      });
    }
    activate();

    /* Abrir modal para crear o editar una noticia */
    function openModalNews() {
      vm.modalNews = $uibModal.open({
          animation: true,
          templateUrl: 'views/modals/news.modal.html',
          scope: $scope,
          size: 'news',
          backdrop: 'static'
        });
    }

    /* Abrir un loading cuando se esta subiendo informacion de la noticia */
    function openModalLoader() {
      vm.modalLoader = $uibModal.open({
          animation: true,
          templateUrl: 'views/modals/loader.modal.html',
          scope: $scope,
          size: 'loader',
          backdrop: 'static'
        });
    }

    /* Metodo para crear una nueva noticia  */
    function createNews(header, description, photo) {
      openModalLoader();
        var refStorage = storageService.ref('imagenes').child(photo.name);
        var uploadTask = refStorage.put(photo);
        uploadTask.on('state_changed', function(snapshot){
          //aqui se puede monitorear la carga de la imagen
        }, function(error) {
            vm.modalLoader.dismiss();
            swal("¡Error al cargar!", "Hay un problema con la carga de la imagen", "error");
        }, function() {
            var downloadURL = uploadTask.snapshot.downloadURL;
            fire.ref('ihj/noticias').push({
              'encabezado': header,
              'descripcion': description,
              'rutaFoto': downloadURL,
              'meGusta': 0,
              'nombreFoto': photo.name
            }).then(function(){
              vm.modalLoader.dismiss();
              swal("¡Noticia Creada!", "La noticia se ha creado satisfactoriamente", "success");
              vm.modalNews.dismiss();
              vm.new = {};
              vm.isnew = false;
            });
        }); 
    }

    /* Abrir imagen de la noticia en una pestaña del navegador */
    function seePhoto( urlPhoto ) {
      $window.open(urlPhoto, '_blank');
    }

    /* Funcion para eliminar una noticia */
    function removeNews( key, namePhoto ) {
      swal({
        title: '¿Estas  seguro?',
        text: "¡La noticia sera eliminada permanentemente!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
      }).then(function () {
        firebase.storage().ref().child('imagenes' + '/' + namePhoto).delete().then(function() {
          // File deleted successfully
          firebase.database().ref('ihj/noticias/' + key).remove().then(function(){
            swal('¡Noticia Eliminada!', 'La noticia se ha eliminado exitosamente!', 'success');
          });   
        }).catch(function(error) {
          // Uh-oh, an error occurred!
            swal(
              'Error!',
              'No se pudo eliminar el archivo!',
              'error'
            )
        });
      });
    }

    /* Obtener los datos de la noticia a actualizar y mostrarlos en el modal */
    function editNews( key ) {
      var noticia = _.find(vm.news, function(item){ return item.$key == key});
      vm.saveKey = noticia.$key;
      vm.saveNamePhoto = noticia.nombreFoto;
      vm.new.header = noticia.encabezado;
      vm.new.description = noticia.descripcion;
      vm.new.pathPhoto = noticia.rutaFoto;
      openModalNews();
    }
    
    /* Funcion para actualizar una noticia */
    function updateNews( header, description, photo ) {
      swal({
        title: '¿Estas  seguro?',
        text: "¡Los datos de la noticia seran actualizados!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
      }).then(function () {
        if (photo == "" || photo == null) {
          fire.ref('ihj/noticias/' + vm.saveKey).update({
            'encabezado': header,
            'descripcion': description
          }).then(function(){
            vm.modalNews.dismiss();
            swal("¡Noticia Actualizada!", "La noticia se ha actualizado satisfactoriamente", "success");
            vm.new = {};
            vm.edit = false;
          });
        }
        else{
          openModalLoader();
          /* Primero eliminamos la foto que tenia anteriormente la noticia */
          firebase.storage().ref().child('imagenes' + '/' + vm.saveNamePhoto).delete().then(function() {
            /* Posteriormente creamos la referencia de la nueva imagen y la subimos al storage */
            var refStorage = storageService.ref('imagenes').child(photo.name);
            var uploadTask = refStorage.put(photo);
            uploadTask.on('state_changed', function(snapshot){
              /* Aqui se puede monitorear la carga de la imagen */
            }, function(error) {
              vm.modalLoader.dismiss();
              swal("¡Error al cargar!", "Hubo un problema al cargar la nueva imagen", "error");
            }, function() {
                var downloadURL = uploadTask.snapshot.downloadURL;
                fire.ref('ihj/noticias/' + vm.saveKey).update({
                  'encabezado': header,
                  'descripcion': description,
                  'rutaFoto': downloadURL,
                  'nombreFoto': photo.name
                }).then(function(){
                  vm.modalLoader.dismiss();
                  vm.modalNews.dismiss();
                  swal("¡Noticia Actualizada!", "La noticia se ha actualizado satisfactoriamente", "success");     
                  vm.new = {};
                  vm.edit = false;
                });
            }); 
          }).catch(function(error) {
            vm.modalLoader.dismiss();
            swal('Error!', 'No se pudo actualizar la imagen de esta noticia!', 'error');
          });
        }
      });    
    }

  }]);