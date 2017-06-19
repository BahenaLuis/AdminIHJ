angular.module('proyectoBaseAngularJsApp')
  .controller('EventsCtrl',['$rootScope','$scope', '$uibModal', function ($rootScope, $scope, $uibModal) {
    
    //private variables
    var vm = this;
    var fire = firebase.database();
    vm.months = new Array("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
    vm.events = {};
    vm.event = {};
    vm.edit = false;
    vm.saveKey = "";

    //public functions 
    vm.openModalEvents = openModalEvents;
    vm.createEvent = createEvent;
    vm.removeEvent = removeEvent;
    vm.editEvent = editEvent;
    vm.updateEvent = updateEvent;



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

    /* Funcion para remover un evento */
    function removeEvent( key ) {
      swal({
        title: '¿Esta seguro?',
        text: "¡El evento sera eliminado permanentemente!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
      }).then(function () {
        fire.ref('ihj/eventos/' + key).remove().then(function(){
          swal('¡Evento Eliminado!', 'El evento ha sido eliminado satisfactoriamente', 'success');
        });
      });
      
    }

    /* Funcion para cargar los datos de un evento cuando se desea actualizarlo */
    function editEvent( key ) {
      vm.saveKey = key;
      var evento = _.find(vm.events, function(event){ return event.$key == key});
      vm.event.title = evento.titulo;
      vm.event.date = evento.fecha;
      vm.event.hour = evento.hora;
      vm.event.place = evento.lugar;
      vm.event.description = evento.descripcion;
      openModalEvents();
    }

    function updateEvent() {
      vm.event.date = document.getElementById("fecha").value;
      vm.event.hour = document.getElementById("hora").value; 
      fire.ref('ihj/eventos/' + vm.saveKey).update({
        'titulo': vm.event.title,
        'fecha': vm.event.date,
        'hora': vm.event.hour,
        'lugar': vm.event.place,
        'descripcion': vm.event.description
      }).then(function(){
        swal("¡Evento Actualizado!", "El evento se ha actualizado satisfactoriamente", "success");
        vm.modalEvents.dismiss();
      }).catch(function(error){
        alert(error);
      });
    }

  }]);

  