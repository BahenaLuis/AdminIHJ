angular.module('proyectoBaseAngularJsApp')
  .controller('EventsCtrl',['$rootScope','$scope', '$uibModal', function ($rootScope, $scope, $uibModal) {
    
    //private variables
    var vm = this;
    var fire = firebase.database();
    vm.months = new Array("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
    vm.events = {};

    //public functions 
    vm.openModalEvents = openModalEvents;
    vm.createEvent = createEvent;



    //private functions 

    function activate() {
      fire.ref('ihj/eventos').on('value', function( snapshot ){
        vm.events = snapshot.val();
        $rootScope.$apply();
      })
    }
    activate();

    function openModalEvents() {
      vm.modalEvents = $uibModal.open({
          animation: true,
          templateUrl: 'views/modals/events.modal.html',
          scope: $scope,
          size: 'news',
          backdrop: 'static'
        });
    }

    function createEvent( titulo, lugar, descripcion ) {
      var fecha = document.getElementById("fecha").value;
      var hora = document.getElementById("hora").value;
      fecha = dateFormat(fecha);
      fire.ref('ihj/eventos').push({
        'titulo': titulo,
        'lugar': lugar,
        'descripcion': descripcion,
        'fecha': fecha,
        'hora': hora,
        'asistentes': 0
      }).then(function(){
        swal("¡Evento Creado!", "El evento se ha creado satisfactoriamente", "success");
      });
      vm.event = {};
      vm.modalEvents.dismiss();
    }
    
    function dateFormat( fecha ) {
      var array = fecha.split("/");
      return array[0] + " de " + vm.months[array[1] -1] + " del " + array[2];
    }

  }]);

  