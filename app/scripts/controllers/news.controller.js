angular.module('proyectoBaseAngularJsApp')
  .controller('NewsCtrl',['$rootScope','$scope', '$uibModal', function ($rootScope, $scope, $uibModal ) {
    
    //private variables
    var vm = this;
    var fire = firebase.database();
    var storageService = firebase.storage();
    vm.news = {};


    //public functions 
    vm.openModalNews = openModalNews;
    vm.createNews = createNews;


    //private functions 
    function activate() {
      fire.ref('ihj/noticias').on('value', function(snapshot){
        vm.news = snapshot.val();
        $rootScope.$apply();
      });
    }
    activate();

    function openModalNews() {
      vm.modalNews = $uibModal.open({
          animation: true,
          templateUrl: 'views/modals/news.modal.html',
          scope: $scope,
          size: 'news',
          backdrop: 'static'
        });
    }

    /* Metodo para crear una nueva noticia  */
    function createNews(header, description, photo) {
      var refStorage = storageService.ref('imagenes').child(photo.name);
      var uploadTask = refStorage.put(photo);
      uploadTask.on('state_changed', function(snapshot){
        //aqui se puede monitorear la carga de la imagen
      }, function(error) {
          swal("¡Error al cargar!", "Hay un problema con la carga de la imagen", "error");
      }, function() {
          var downloadURL = uploadTask.snapshot.downloadURL;
          fire.ref('ihj/noticias').push({
            'encabezado': header,
            'descripcion': description,
            'rutaFoto': downloadURL 
          }).then(function(){
            swal("¡Noticia Creada!", "La noticia se ha creado satisfactoriamente", "success");
          });
      });

      
    }




  }]);