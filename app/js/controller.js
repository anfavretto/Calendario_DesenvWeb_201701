var app = angular.module("calendar", []);

    app.controller("controllerCalendar", function($scope) {
        $scope.day = moment();
    });
			
	(function (factory) {
	    if (typeof define === 'function' && define.amd) {
		    define(['moment'], factory); // AMD
        } else if (typeof exports === 'object') {
		    module.exports = factory(require('../moment')); // Node
        } else {
		    factory(window.moment); // Browser global
        }
		
        //Função para deixar o moment.js em portugues
    }(function (moment) {
	    return moment.defineLocale('pt-br', {
		    months : 'janeiro.fevereiro.março.abril.maio.junho.julho.agosto.setembro.outubro.novembro.dezembro'.split('.'),
			monthsShort : 'jan.fev.mar.abr.mai.jun.jul.ago.set.out.nov.dez'.split('.'),
			weekdays : 'Domingo.Segunda-feira.terça-feira.quarta-feira.quinta-feira.sexta-feira.sábado'.split('.'),
			weekdaysShort : 'dom.seg.ter.qua.qui.sex.sáb'.split('.'),
			longDateFormat : {
                LT : 'HH:mm',
                L : 'DD/MM/YYYY',
                LL : 'D [de] MMMM [de] YYYY',
                LLL : 'D [de] MMMM [de] YYYY [às] LT',
                LLLL : 'dddd, D [de] MMMM [de] YYYY [às] LT'
		    },
			calendar : {
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
			relativeTime : {
				future : 'em %s',
				past : '%s atrás',
				s : 'segundos',
				m : 'um minuto',
				mm : '%d minutos',
				h : 'uma hora',
				hh : '%d horas',
				d : 'um dia',
				dd : '%d dias',
				M : 'um mês',
				MM : '%d meses',
				y : 'um ano',
				yy : '%d anos'
			},
			ordinal : '%dº'
		});
	}));

    app.directive("calendar", function() {
        return {
            restrict: "E",
            templateUrl: "templates/calendar.html",
            scope: {
                selected: "="
            },
            link: function(scope) {
                /*
                    Define um valor inicial para o dia selecionado, 
                    com base no fato de o dia ainda não ter sido definido. 
                    Se não tiver sido, apenas usamos a data de hoje. 
                    Usamos Moment para definir a hora para a meia-noite e, 
                    em seguida, gerar a data de início atual para o mês inicial do calendário.
                */
                scope.selected = _removeTime(scope.selected || moment());
                scope.month = scope.selected.clone();

                var start = scope.selected.clone();
                start.date(1);
                _removeTime(start.day(0)); //meia noite

                _buildMonth(scope, start, scope.month);

                scope.select = function(day) {
                    scope.selected = day.date;
                };
                scope.next = function() {
                    var next = scope.month.clone();
                    _removeTime(next.month(next.month()+1).date(1));
                    scope.month.month(scope.month.month()+1);
                    _buildMonth(scope, next, scope.month);
                };

                scope.previous = function() {
                    var previous = scope.month.clone();
                    _removeTime(previous.month(previous.month()-1).date(1));
                    scope.month.month(scope.month.month()-1);
                    _buildMonth(scope, previous, scope.month);
                };
            }
        };

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