var app = angular.module("calendar", []);

app.controller("controllerCalendar", function ($scope) {

    $scope.day = moment().date;
    $scope.visualizacaoAtualMes = true;

    $scope.$on("selectDate", function (event, dateSelected) {
        var chaveEvento = dateSelected.format('YYYYMMDD');
        $scope.eventos = LS.getData(chaveEvento, 'E');
        $scope.lembretes = LS.getData(chaveEvento, 'L');        
        $scope.day = dateSelected;
    });

    $scope.$on("nextDate", function () {
        $scope.day.date($scope.day.date() + 1);
    });

    $scope.$on("previousDate", function () {
        $scope.day.date($scope.day.date() - 1);
    });

    function EventoData() {
        this.descricao = "";
        this.data = $scope.day.date;
        this.titulo = "";
        this.hora = 0;
        this.minuto = 0;
    }

    EventoData.prototype.copy = function () {
        console.log(this.minuto);
        return {
            descricao: this.descricao,
            titulo: this.titulo,
            data: $scope.day.date,
            hora: this.hora,
            minuto: this.minuto
        }
    };

    EventoData.prototype.clear = function () {
        this.descricao = "";
        this.titulo = "";       
    };

    $scope.eventoData = new EventoData();
    
    $scope.removerEvento = function(i){
        var chaveEvento = $scope.day.format('YYYYMMDD');       
        $scope.eventos.splice(i, 1);
        LS.saveData(chaveEvento, $scope.eventos, 'E');
    };

    $scope.adicionarEvento = function () {  
        if ($scope.eventos == undefined) $scope.eventos = new Array();
        var chaveEvento = $scope.day.format('YYYYMMDD');
        $scope.eventos.push($scope.eventoData.copy());
        $scope.eventoData.clear();

        LS.saveData(chaveEvento, $scope.eventos, 'E');
    };

    function Lembrete() {
        this.descricao = "";
        this.data = $scope.day.date;
        this.titulo = "";
        this.hora = 0;
        this.minuto = 0;
        this.concluido = false;
        this.diaTodo = true;
    }

    Lembrete.prototype.copy = function () {
        return {
            descricao: this.descricao,
            titulo: this.titulo,
            data: $scope.day.date,
            hora: this.hora,
            minuto: this.minuto,
            concluido: this.concluido,
            diaTodo: this.diaTodo
        }
    };

    Lembrete.prototype.clear = function () {
        this.descricao = "";
        this.titulo = "";   
        this.hora = 0;
        this.minuto = 0;
        this.concluido = false;
        this.diaTodo = true;
    };

    $scope.lembreteAtual = new Lembrete();

    $scope.adicionarLembrete = function () {  
        if ($scope.lembretes == undefined) $scope.lembretes = new Array();
        var chaveLembrete = $scope.day.format('YYYYMMDD');
        $scope.lembretes.push($scope.lembreteAtual.copy());
        console.log($scope.lembreteAtual.diaTodo);
        $scope.lembreteAtual.clear();

        LS.saveData(chaveLembrete, $scope.lembretes, 'L');
    };

    $scope.removerLembrete = function(i){
        var chaveLembrete = $scope.day.format('YYYYMMDD');       
        $scope.lembretes.splice(i, 1);
        LS.saveData(chaveLembrete, $scope.lembretes, 'L');
    };
    
});

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['moment'], factory); // AMD
    } else if (typeof exports === 'object') {
        module.exports = factory(require('../moment')); // Node
    } else {
        factory(window.moment); // Browser global
    }
    LS.hasStorage();
    //Função para deixar o moment.js em portugues
}(function (moment) {
    return moment.defineLocale('pt-br', {
        months: 'janeiro.fevereiro.março.abril.maio.junho.julho.agosto.setembro.outubro.novembro.dezembro'.split('.'),
        monthsShort: 'jan.fev.mar.abr.mai.jun.jul.ago.set.out.nov.dez'.split('.'),
        weekdays: 'Domingo.Segunda-feira.terça-feira.quarta-feira.quinta-feira.sexta-feira.sábado'.split('.'),
        weekdaysShort: 'dom.seg.ter.qua.qui.sex.sáb'.split('.'),
        longDateFormat: {
            LT: 'HH:mm',
            L: 'DD/MM/YYYY',
            LL: 'D [de] MMMM [de] YYYY',
            LLL: 'D [de] MMMM [de] YYYY [às] LT',
            LLLL: 'dddd, D [de] MMMM [de] YYYY [às] LT'
        },
        calendar: {
            sameDay: '[Hoje às] LT',
            nextDay: '[Amanhã às] LT',
            nextWeek: 'dddd [às] LT',
            lastDay: '[Ontem às] LT',
            lastWeek: function () {
                return (this.day() === 0 || this.day() === 6) ?
                    '[Último] dddd [às] LT' : // Saturday + Sunday
                    '[Última] dddd [às] LT'; // Monday - Friday
            },
            sameElse: 'L'
        },
        relativeTime: {
            future: 'em %s',
            past: '%s atrás',
            s: 'segundos',
            m: 'um minuto',
            mm: '%d minutos',
            h: 'uma hora',
            hh: '%d horas',
            d: 'um dia',
            dd: '%d dias',
            M: 'um mês',
            MM: '%d meses',
            y: 'um ano',
            yy: '%d anos'
        },
        ordinal: '%dº'
    });
}));

app.directive("calendar", function () {
    return {
        restrict: "E",
        templateUrl: "templates/calendar.html",
        link: function (scope) {
            /*
                Define um valor inicial para o dia selecionado, 
                com base no fato de o dia ainda não ter sido definido. 
                Se não tiver sido, apenas usamos a data de hoje. 
                Usamos Moment para definir a hora para a meia-noite e, 
                em seguida, gerar a data de início atual para o mês inicial do calendário.
            */
            // debugger;
            scope.selected = moment();
            scope.month = scope.selected.clone();

            var start = scope.selected.clone();
            start.date(1);
            _removeTime(start.day(0)); //meia noite

            _buildMonth(scope, start, scope.month);

            scope.$emit("selectDate", scope.selected);

            scope.select = function (day) {
                scope.selected = day.date;
                scope.$emit("selectDate", day.date);
            };
            

            scope.next = function () {
                var next = scope.month.clone();
                _removeTime(next.month(next.month() + 1).date(1));
                scope.month.month(scope.month.month() + 1);
                _buildMonth(scope, next, scope.month);
            };

            scope.previous = function () {
                var previous = scope.month.clone();
                _removeTime(previous.month(previous.month() - 1).date(1));
                scope.month.month(scope.month.month() - 1);
                _buildMonth(scope, previous, scope.month);
            };
        }
    };

    function shouldDateBeShown(dt, dt2) {
            var datea = moment(dt).format("DD/MM/YYYY");
            var dateb = moment(dt2).format("DD/MM/YYYY");
            return datea == dateb;
    }
    
    function _removeTime(date) {
        return date.day(0).hour(0).minute(0).second(0).millisecond(0);
    }

    function _buildMonth(scope, start, month) {
        scope.weeks = [];
        var done = false, date = start.clone(), monthIndex = date.month(), count = 0;
        while (!done) {
            scope.weeks.push({ days: _buildWeek(date.clone(), month) });
            date.add(1, "w");
            done = count++ > 2 && monthIndex !== date.month();
            monthIndex = date.month();
        }
    }    

    function _buildWeek(date, month) {
        var days = [];
        for (var i = 0; i < 7; i++) {
            days.push({
                name: date.format("dd").substring(0, 1),
                number: date.date(),
                isCurrentMonth: date.month() === month.month(),
                isToday: date.isSame(new Date(), "day"),
                date: date
            });
            date = date.clone();
            date.add(1, "d");
        }
        return days;
    }
});

app.directive("calendarday", function () {
    return {
        restrict: "E",
        templateUrl: 'templates/calendarday.html',
        link: function (scope) {

            scope.selected = _removeTime(scope.selected || moment());
            scope.currentDay = scope.selected.clone().hour(1);

            _buildHours(scope.currentDay);

            scope.nextDay = function () {
                scope.$emit("nextDate");
            };

            scope.previousDay = function () {
                scope.$emit("previousDate");
            };

            function _buildHours(date) {
                scope.hours = [];
                for (var i = 0; i < 24; i++) {
                    scope.hours.push({
                        name: date.hour() + ":00",
                        number: date.hour(),
                        date: date
                    });
                    date = date.clone();
                    date.add(1, "hour");
                }
            }
        }
    };

    function _removeTime(date) {
        return date.hour(0).minute(0).second(0).millisecond(0);
    }
});