/ *!
* jQuery Cycle2; versão: 2.1.6 build: 20141007
* http://jquery.malsup.com/cycle2/
* Copyright (c) 2014 M. Alsup; Licença dupla: MIT / GPL
* /

/ * Motor principal Cycle2 * /
; (função ($) {
"use estrito";

var version = '2.1.6';

$ .fn.cycle = função (opções) {
    // conserta erros com o estado pronto
    var o;
    if (this.length === 0 &&! $. isReady) {
        o = {s: este.seletor, c: este.contexto};
        $ .fn.cycle.log ('enfileirando a apresentação de slides (dom não está pronto)');
        $ (function () {
            $ (os, oc) .cycle (opções);
        });
        devolva isso;
    }

    return this.each (function () {
        dados var, opts, shortName, val;
        var container = $ (this);
        var log = $ .fn.cycle.log;

        if (container.data ('cycle.opts'))
            Retorna; // já inicializado

        if (container.data ('cycle-log') === false || 
            (opções && options.log === false) ||
            (opta && opts.log === false)) {
            log = $ .noop;
        }

        log ('- c2 init--');
        dados = container.data ();
        para (var p nos dados) {
            // permite que os adereços sejam acessados ​​sem o prefixo de 'ciclo' e registra as substituições
            if (data.hasOwnProperty (p) && /^cycle[AZ]+/.test(p)) {
                val = dados [p];
                shortName = p.match (/ ^ ciclo (. *) /) [1] .replace (/ ^ [AZ] /, lowerCase);
                log (shortName + ':', val, '(' + typeof val + ')');
                dados [shortName] = val;
            }
        }

        opts = $ .extend ({}, $ .fn.cycle.defaults, data, options || {});

        opts.timeoutId = 0;
        opts.paused = opts.paused || falso; // # 57
        opts.container = container;
        opts._maxZ = opts.maxZ;

        opts.API = $ .extend ({_container: container}, $ .fn.cycle.API);
        opts.API.log = log;
        opts.API.trigger = function (eventName, args) {
            opts.container.trigger (eventName, args);
            return opts.API;
        };

        container.data ('cycle.opts', opts);
        container.data ('ciclo.API', opts.API);

        // oportunidade para plug-ins de modificar opções e API
        opts.API.trigger ('cycle-bootstrap', [opts, opts.API]);

        opts.API.addInitialSlides ();
        opts.API.preInitSlideshow ();

        if (opts.slides.length)
            opts.API.initSlideshow ();
    });
};

$ .fn.cycle.API = {
    opta: function () {
        retornar this._container.data ('cycle.opts');
    },
    addInitialSlides: function () {
        var opts = this.opts ();
        var slides = opts.slides;
        opts.slideCount = 0;
        opts.slides = $ (); // conjunto vazio
        
        // adiciona slides que já existem
        slides = slides.jquery? slides: opts.container.find (slides);

        if (opts.random) {
            slides.sort (function () {return Math.random () - 0,5;});
        }

        opts.API.add (slides);
    },

    preInitSlideshow: function () {
        var opts = this.opts ();
        opts.API.trigger ('ciclo-pré-inicializar', [opts]);
        var tx = $ .fn.cycle.transitions [opts.fx];
        if (tx && $ .isFunction (tx.preInit))
            tx.preInit (opta);
        opts._preInitialized = true;
    },

    postInitSlideshow: function () {
        var opts = this.opts ();
        opts.API.trigger ('ciclo-pós-inicialização', [opts]);
        var tx = $ .fn.cycle.transitions [opts.fx];
        if (tx && $ .isFunction (tx.postInit))
            tx.postInit (opta);
    },

    initSlideshow: function () {
        var opts = this.opts ();
        var pauseObj = opts.container;
        var slideOpts;
        opts.API.calcFirstSlide ();

        if (opts.container.css ('position') == 'static')
            opts.container.css ('posição', 'relativo');

        $ (opts.slides [opts.currSlide]). css ({
            opacidade: 1,
            exibir: 'bloquear',
            visibilidade: 'visível'
        });
        opts.API.stackSlides (opts.slides [opts.currSlide], opts.slides [opts.nextSlide],! opts.reverse);

        if (opts.pauseOnHover) {
            // permite que pauseOnHover especifique um elemento
            if (opts.pauseOnHover! == true)
                pauseObj = $ (opts.pauseOnHover);

            pauseObj.hover (
                function () {opts.API.pause (true); },
                função () {opts.API.resume (true); }
            );
        }

        // fase de transição inicial
        if (opts.timeout) {
            slideOpts = opts.API.getSlideOpts (opts.currSlide);
            opts.API.queueTransition (slideOpts, slideOpts.timeout + opts.delay);
        }

        opts._initialized = true;
        opts.API.updateView (true);
        opts.API.trigger ('ciclo inicializado', [opts]);
        opts.API.postInitSlideshow ();
    },

    pause: function (hover) {
        var opts = this.opts (),
            slideOpts = opts.API.getSlideOpts (),
            jáPaused = opts.hoverPaused || opts.paused;

        if (pairar)
            opts.hoverPaused = true; 
        senão
            opts.paused = true;

        if (! jáPaused) {
            opts.container.addClass ('ciclo em pausa');
            opts.API.trigger ('ciclo em pausa', [opta]). log ('ciclo em pausa');

            if (slideOpts.timeout) {
                clearTimeout (opts.timeoutId);
                opts.timeoutId = 0;
                
                // determina quanto tempo resta para o slide atual
                opts._remainingTimeout - = ($ .now () - opts._lastQueue);
                if (opts._remainingTimeout <0 || isNaN (opts._remainingTimeout))
                    opts._remainingTimeout = undefined;
            }
        }
    },

    resume: function (hover) {
        var opts = this.opts (),
            jáResumed =! opts.hoverPaused &&! opts.paused,
            remanescente;

        if (pairar)
            opts.hoverPaused = false; 
        senão
            opts.paused = false;

    
        if (! já Resumido) {
            opts.container.removeClass ('ciclo em pausa');
            // # gh-230; se uma animação estiver em andamento, não enfileire uma nova transição; será
            // acontecer naturalmente
            if (opts.slides.filter (': animado'). comprimento === 0)
                opts.API.queueTransition (opts.API.getSlideOpts (), opts._remainingTimeout);
            opts.API.trigger ('ciclo retomado', [opts, opts._remainingTimeout]) .log ('ciclo retomado');
        }
    },

    add: function (slides, prepend) {
        var opts = this.opts ();
        var oldSlideCount = opts.slideCount;
        var startSlideshow = false;
        var len;

        if ($ .type (slides) == 'string')
            slides = $ .trim (slides);

        $ (slides) .each (function (i) {
            var slideOpts;
            var slide = $ (this);

            if (prefixar)
                opts.container.prepend (slide);
            senão
                opts.container.append (slide);

            opts.slideCount ++;
            slideOpts = opts.API.buildSlideOpts (slide);

            if (prefixar)
                opts.slides = $ (slide) .add (opts.slides);
            senão
                opts.slides = opts.slides.add (slide);

            opts.API.initSlide (slideOpts, slide, --opts._maxZ);

            slide.data ('cycle.opts', slideOpts);
            opts.API.trigger ('ciclo-slide-adicionado', [opts, slideOpts, slide]);
        });

        opts.API.updateView (true);

        startSlideshow = opts._preInitialized && (oldSlideCount <2 && opts.slideCount> = 1);
        if (startSlideshow) {
            if (! opts._initialized)
                opts.API.initSlideshow ();
            else if (opts.timeout) {
                len = opts.slides.length;
                opts.nextSlide = opts.reverse? len - 1: 1;
                if (! opts.timeoutId) {
                    opts.API.queueTransition (opts);
                }
            }
        }
    },

    calcFirstSlide: function () {
        var opts = this.opts ();
        var firstSlideIndex;
        firstSlideIndex = parseInt (opts.startingSlide || 0, 10);
        if (firstSlideIndex> = opts.slides.length || firstSlideIndex <0)
            firstSlideIndex = 0;

        opts.currSlide = firstSlideIndex;
        if (opts.reverse) {
            opts.nextSlide = firstSlideIndex - 1;
            if (opts.nextSlide <0)
                opts.nextSlide = opts.slides.length - 1;
        }
        senão {
            opts.nextSlide = firstSlideIndex + 1;
            if (opts.nextSlide == opts.slides.length)
                opts.nextSlide = 0;
        }
    },

    calcNextSlide: function () {
        var opts = this.opts ();
        var roll;
        if (opts.reverse) {
            roll = (opts.nextSlide - 1) <0;
            opts.nextSlide = roll? opts.slideCount - 1: opts.nextSlide-1;
            opts.currSlide = roll? 0: opts.nextSlide + 1;
        }
        senão {
            roll = (opts.nextSlide + 1) == opts.slides.length;
            opts.nextSlide = roll? 0: opts.nextSlide + 1;
            opts.currSlide = roll? opts.slides.length-1: opts.nextSlide-1;
        }
    },

    calcTx: function (slideOpts, manual) {
        var opts = slideOpts;
        var tx;

        if (opts._tempFx)
            tx = $ .fn.cycle.transitions [opts._tempFx];
        else if (manual && opts.manualFx)
            tx = $ .fn.cycle.transitions [opts.manualFx];

        if (! tx)
            tx = $ .fn.cycle.transitions [opts.fx];

        opts._tempFx = null;
        this.opts () ._ tempFx = null;

        if (! tx) {
            tx = $ .fn.cycle.transitions.fade;
            opts.API.log ('Transição "' + opts.fx + '" não encontrado. Usando fade.');
        }
        return tx;
    },

    prepareTx: function (manual, fwd) {
        var opts = this.opts ();
        var after, curr, next, slideOpts, tx;

        if (opts.slideCount <2) {
            opts.timeoutId = 0;
            Retorna;
        }
        if (manual && (! opts.busy || opts.manualTrump)) {
            opts.API.stopTransition ();
            opts.busy = false;
            clearTimeout (opts.timeoutId);
            opts.timeoutId = 0;
        }
        if (opts.busy)
            Retorna;
        if (opts.timeoutId === 0 &&! manual)
            Retorna;

        curr = opts.slides [opts.currSlide];
        next = opts.slides [opts.nextSlide];
        slideOpts = opts.API.getSlideOpts (opts.nextSlide);
        tx = opts.API.calcTx (slideOpts, manual);

        opts._tx = tx;

        if (manual && slideOpts.manualSpeed! == undefined)
            slideOpts.speed = slideOpts.manualSpeed;

        // if (opts.nextSlide === opts.currSlide)
        // opts.API.calcNextSlide ();

        // Garanta que:
        // 1. avançando para um slide diferente
        // 2. este é um evento manual (anterior / próximo, pager, cmd) ou 
        // um evento temporizador e a apresentação de slides não são pausados
        if (opts.nextSlide! = opts.currSlide && 
            (manual || (! opts.paused &&! opts.hoverPaused && opts.timeout))) {// # 62

            opts.API.trigger ('ciclo antes', [slideOpts, curr, next, fwd]);
            if (tx.before)
                tx.before (slideOpts, curr, next, fwd);

            after = function () {
                opts.busy = false;
                // # 76; fiança se a apresentação de slides foi destruída
                if (! opts.container.data ('cycle.opts'))
                    Retorna;

                if (tx.after)
                    tx.after (slideOpts, curr, next, fwd);
                opts.API.trigger ('ciclo após', [slideOpts, curr, next, fwd]);
                opts.API.queueTransition (slideOpts);
                opts.API.updateView (true);
            };

            opts.busy = true;
            if (tx.transition)
                tx.transition (slideOpts, curr, next, fwd, after);
            senão
                opts.API.doTransition (slideOpts, curr, next, fwd, after);

            opts.API.calcNextSlide ();
            opts.API.updateView ();
        } senão {
            opts.API.queueTransition (slideOpts);
        }
    },

    // executa a animação real
    doTransition: function (slideOpts, currEl, nextEl, fwd, callback) {
        var opts = slideOpts;
        var curr = $ (currEl), next = $ (nextEl);
        var fn = function () {
            // certifique-se de que animIn tem algo para que o retorno de chamada não seja acionado imediatamente
            next.animate (opts.animIn || {opacidade: 1}, opts.speed, opts.easeIn || opts.easing, callback);
        };

        next.css (opts.cssBefore || {});
        curr.animate (opts.animOut || {}, opts.speed, opts.easeOut || opts.easing, function () {
            curr.css (opts.cssAfter || {});
            if (! opts.sync) {
                fn ();
            }
        });
        if (opts.sync) {
            fn ();
        }
    },

    queueTransition: function (slideOpts, specificTimeout) {
        var opts = this.opts ();
        var timeout = specificTimeout! == indefinido? specificTimeout: slideOpts.timeout;
        if (opts.nextSlide === 0 && --opts.loop === 0) {
            opts.API.log ('encerrando; loop = 0');
            opts.timeout = 0;
            if (tempo limite) {
                setTimeout (function () {
                    opts.API.trigger ('ciclo concluído', [opts]);
                }, tempo esgotado);
            }
            senão {
                opts.API.trigger ('ciclo concluído', [opts]);
            }
            // redefine o nextSlide
            opts.nextSlide = opts.currSlide;
            Retorna;
        }
        if (opts.continueAuto! == undefined) {
            if (opts.continueAuto === false || 
                ($ .isFunction (opts.continueAuto) && opts.continueAuto () === false)) {
                opts.API.log ('encerrando transições automáticas');
                opts.timeout = 0;
                if (opts.timeoutId)
                    clearTimeout (opts.timeoutId);
                Retorna;
            }
        }
        if (tempo limite) {
            opts._lastQueue = $ .now ();
            if (specificTimeout === indefinido)
                opts._remainingTimeout = slideOpts.timeout;

            if (! opts.paused &&! opts.hoverPaused) {
                opts.timeoutId = setTimeout (function () { 
                    opts.API.prepareTx (false,! opts.reverse); 
                }, tempo esgotado );
            }
        }
    },

    stopTransition: function () {
        var opts = this.opts ();
        if (opts.slides.filter (': animado'). comprimento) {
            opts.slides.stop (falso, verdadeiro);
            opts.API.trigger ('ciclo-transição interrompida', [opts]);
        }

        if (opts._tx && opts._tx.stopTransition)
            opts._tx.stopTransition (opts);
    },

    // avançar slide para frente ou para trás
    advanceSlide: function (val) {
        var opts = this.opts ();
        clearTimeout (opts.timeoutId);
        opts.timeoutId = 0;
        opts.nextSlide = opts.currSlide + val;
        
        if (opts.nextSlide <0)
            opts.nextSlide = opts.slides.length - 1;
        else if (opts.nextSlide> = opts.slides.length)
            opts.nextSlide = 0;

        opts.API.prepareTx (true, val> = 0);
        retorna falso;
    },

    buildSlideOpts: function (slide) {
        var opts = this.opts ();
        var val, shortName;
        var slideOpts = slide.data () || {};
        para (var p em slideOpts) {
            // permite que os adereços sejam acessados ​​sem o prefixo de 'ciclo' e registra as substituições
            if (slideOpts.hasOwnProperty (p) && /^cycle[AZ]+/.test(p)) {
                val = slideOpts [p];
                shortName = p.match (/ ^ ciclo (. *) /) [1] .replace (/ ^ [AZ] /, lowerCase);
                opts.API.log ('[' + (opts.slideCount-1) + ']', shortName + ':', val, '(' + typeof val + ')');
                slideOpts [shortName] = val;
            }
        }

        slideOpts = $ .extend ({}, $ .fn.cycle.defaults, opts, slideOpts);
        slideOpts.slideNum = opts.slideCount;

        tentar {
            // esses adereços devem sempre ser lidos a partir do objeto de estado mestre
            delete slideOpts.API;
            delete slideOpts.slideCount;
            delete slideOpts.currSlide;
            delete slideOpts.nextSlide;
            delete slideOpts.slides;
        } catch (e) {
            // sem op
        }
        return slideOpts;
    },

    getSlideOpts: function (index) {
        var opts = this.opts ();
        if (índice === indefinido)
            índice = opts.currSlide;

        var slide = opts.slides [índice];
        var slideOpts = $ (slide) .data ('cycle.opts');
        return $ .extend ({}, opts, slideOpts);
    },
    
    initSlide: function (slideOpts, slide, suggestedZindex) {
        var opts = this.opts ();
        slide.css (slideOpts.slideCss || {});
        se (sugeridoZindex> 0)
            slide.css ('zIndex', suggestedZindex);

        // certifique-se de que as configurações de velocidade são razoáveis
        if (isNaN (slideOpts.speed))
            slideOpts.speed = $ .fx.speeds [slideOpts.speed] || $ .fx.speeds._default;
        if (! slideOpts.sync)
            slideOpts.speed = slideOpts.speed / 2;

        slide.addClass (opts.slideClass);
    },

    updateView: function (isAfter, isDuring, forceEvent) {
        var opts = this.opts ();
        if (! opts._initialized)
            Retorna;
        var slideOpts = opts.API.getSlideOpts ();
        var currSlide = opts.slides [opts.currSlide];

        if (! isAfter && isDuring! == true) {
            opts.API.trigger ('ciclo-atualização-visualização-antes', [opts, slideOpts, currSlide]);
            if (opts.updateView <0)
                Retorna;
        }

        if (opts.slideActiveClass) {
            opts.slides.removeClass (opts.slideActiveClass)
                .eq (opts.currSlide) .addClass (opts.slideActiveClass);
        }

        if (isAfter && opts.hideNonActive)
            opts.slides.filter (': not (.' + opts.slideActiveClass + ')') .css ('visibilidade', 'oculto');

        if (opts.updateView === 0) {
            setTimeout (function () {
                opts.API.trigger ('cycle-update-view', [opts, slideOpts, currSlide, isAfter]);
            }, slideOpts.speed / (opts.sync? 2: 1));
        }

        if (opts.updateView! == 0)
            opts.API.trigger ('cycle-update-view', [opts, slideOpts, currSlide, isAfter]);
        
        if (isAfter)
            opts.API.trigger ('ciclo-atualização-visualização-após', [opts, slideOpts, currSlide]);
    },

    getComponent: function (name) {
        var opts = this.opts ();
        var selector = opts [nome];
        if (seletor de tipo === 'string') {
            // se o seletor for filho, combinador irmão, seletor adjuvante, use encontrar, caso contrário, consulte o dom completo
            return (/ ^ \ s * [\> | \ + | ~] /). test (seletor)? opts.container.find (seletor): $ (seletor);
        }
        if (selector.jquery)
            seletor de retorno;
        
        return $ (seletor);
    },

    stackSlides: function (curr, next, fwd) {
        var opts = this.opts ();
        if (! curr) {
            curr = opts.slides [opts.currSlide];
            next = opts.slides [opts.nextSlide];
            fwd =! opts.reverse;
        }

        // redefine o zIndex para o caso comum:
        // slide curr no topo, próximo slide abaixo e o resto para ser mostrado
        $ (curr) .css ('zIndex', opts.maxZ);

        var i;
        var z = opts.maxZ - 2;
        var len = opts.slideCount;
        if (fwd) {
            para (i = opts.currSlide + 1; i <len; i ++)
                $ (opts.slides [i]) .css ('zIndex', z--);
            para (i = 0; i <opts.currSlide; i ++)
                $ (opts.slides [i]) .css ('zIndex', z--);
        }
        senão {
            para (i = opts.currSlide - 1; i> = 0; i--)
                $ (opts.slides [i]) .css ('zIndex', z--);
            para (i = len - 1; i> opts.currSlide; i--)
                $ (opts.slides [i]) .css ('zIndex', z--);
        }

        $ (próximo) .css ('zIndex', opts.maxZ - 1);
    },

    getSlideIndex: function (el) {
        retornar this.opts (). slides.index (el);
    }

}; // API

// logger padrão
$ .fn.cycle.log = log de função () {
    / * console global: verdadeiro * /
    if (window.console && console.log)
        console.log ('[ciclo2]' + Array.prototype.join.call (argumentos, ''));
};

$ .fn.cycle.version = function () {return 'Cycle2:' + version; };

// funções auxiliares

function lowerCase (s) {
    return (s || '') .toLowerCase ();
}

// expor objeto de transição
$ .fn.cycle.transitions = {
    personalizadas: {
    },
    Nenhum: {
        before: function (opts, curr, next, fwd) {
            opts.API.stackSlides (próximo, curr, fwd);
            opts.cssBefore = {opacidade: 1, visibilidade: 'visível', exibição: 'bloquear'};
        }
    },
    desaparecer: {
        before: function (opts, curr, next, fwd) {
            var css = opts.API.getSlideOpts (opts.nextSlide) .slideCss || {};
            opts.API.stackSlides (curr, next, fwd);
            opts.cssBefore = $ .extend (css, {opacidade: 0, visibilidade: 'visível', exibição: 'bloco'});
            opts.animIn = {opacidade: 1};
            opts.animOut = {opacidade: 0};
        }
    },
    desaparecer: {
        before: function (opts, curr, next, fwd) {
            var css = opts.API.getSlideOpts (opts.nextSlide) .slideCss || {};
            opts.API.stackSlides (curr, next, fwd);
            opts.cssBefore = $ .extend (css, {opacidade: 1, visibilidade: 'visível', exibição: 'bloco'});
            opts.animOut = {opacidade: 0};
        }
    },
    scrollHorz: {
        before: function (opts, curr, next, fwd) {
            opts.API.stackSlides (curr, next, fwd);
            var w = opts.container.css ('overflow', 'hidden'). width ();
            opts.cssBefore = {left: fwd? w: - w, topo: 0, opacidade: 1, visibilidade: 'visível', exibição: 'bloco'};
            opts.cssAfter = {zIndex: opts._maxZ - 2, esquerda: 0};
            opts.animIn = {esquerda: 0};
            opts.animOut = {left: fwd? -w: w};
        }
    }
};

// @see: http://jquery.malsup.com/cycle2/api
$ .fn.cycle.defaults = {
    allowWrap: true,
    autoSelector: '.cycle-slideshow [data-cycle-auto-init! = false]',
    atraso: 0,
    easing: null,
    fx: 'fade',
    hideNonActive: true,
    loop: 0,
    manualFx: indefinido,
    manualSpeed: undefined,
    manualTrump: verdadeiro,
    maxZ: 100,
    pauseOnHover: false,
    reverso: falso,
    slideActiveClass: 'cycle-slide-active',
    slideClass: 'cycle-slide',
    slideCss: {position: 'absoluto', top: 0, left: 0},
    slides: '> img',
    velocidade: 500,
    começandoSlide: 0,
    sync: true,
    tempo limite: 4000,
    updateView: 0
};

// encontre e execute apresentações de slides automaticamente
$ (document) .ready (function () {
    $ ($ .fn.cycle.defaults.autoSelector) .cycle ();
});

}) (jQuery);

/ *! Plugin autoheight Cycle2; Copyright (c) M.Alsup, 2012; versão: 20130913 * /
(função ($) {
"use estrito";

$ .extend ($. fn.cycle.defaults, {
    autoHeight: 0, // definir esta opção como false desativa a lógica autoHeight
    autoHeightSpeed: 250,
    autoHeightEasing: null
});    

$ (documento) .on ('inicializado por ciclo', função (e, opta) {
    var autoHeight = opts.autoHeight;
    var t = $ .type (autoHeight);
    var resizeThrottle = null;
    proporção de var;

    if (t! == 'string' && t! == 'número')
        Retorna;

    // vincular eventos
    opts.container.on ('ciclo-slide-adicionado ciclo-slide-removido', initAutoHeight);
    opts.container.on ('ciclo destruído', onDestroy);

    if (autoHeight == 'container') {
        opts.container.on ('ciclo antes', onBefore);
    }
    else if (t === 'string' && / \ d + \: \ d + /. test (autoHeight)) { 
        // razão de uso
        proporção = autoHeight.match (/ (\ d +) \: (\ d +) /);
        proporção = proporção [1] / proporção [2];
        opts._autoHeightRatio = ratio;
    }

    // se autoHeight for um número, não precisamos recalcular a sentinela
    // indexar ao redimensionar
    if (t! == 'número') {
        // vincular manipulador de redimensionamento exclusivo por apresentação de slides (para que possa ser desativado em onDestroy)
        opts._autoHeightOnResize = function () {
            clearTimeout (resizeThrottle);
            resizeThrottle = setTimeout (onResize, 50);
        };

        $ (janela) .on ('redimensionar mudança de orientação', opts._autoHeightOnResize);
    }

    setTimeout (onResize, 30);

    function onResize () {
        initAutoHeight (e, opta);
    }
});

function initAutoHeight (e, opts) {
    var clone, altura, sentinelIndex;
    var autoHeight = opts.autoHeight;

    if (autoHeight == 'container') {
        height = $ (opts.slides [opts.currSlide]) .outerHeight ();
        opts.container.height (altura);
    }
    else if (opts._autoHeightRatio) { 
        opts.container.height (opts.container.width () / opts._autoHeightRatio);
    }
    else if (autoHeight === 'calc' || ($ .type (autoHeight) == 'number' && autoHeight> = 0)) {
        if (autoHeight === 'calc')
            sentinelIndex = calcSentinelIndex (e, opta);
        else if (autoHeight> = opts.slides.length)
            sentinelIndex = 0;
        senão 
            sentinelIndex = autoHeight;

        // apenas recriar o sentinela se o índice for diferente
        if (sentinelIndex == opts._sentinelIndex)
            Retorna;

        opts._sentinelIndex = sentinelIndex;
        if (opts._sentinel)
            opts._sentinel.remove ();

        // clonar slide existente como sentinela
        clone = $ (opts.slides [sentinelIndex] .cloneNode (true));
        
        // # 50; remover atributos especiais do conteúdo clonado
        clone.removeAttr ('id nome rel') .find ('[id], [nome], [rel]') .removeAttr ('id nome rel');

        clone.css ({
            posição: 'estático',
            visibilidade: 'oculto',
            display: 'bloquear'
        }). prependTo (opts.container) .addClass ('ciclo-sentinela ciclo-slide'). removeClass ('ciclo-slide-ativo');
        clone.find ('*') .css ('visibilidade', 'oculto');

        opts._sentinel = clone;
    }
}    

function calcSentinelIndex (e, opts) {
    índice de var = 0, máx = -1;

    // calcula o índice de slide mais alto
    opts.slides.each (function (i) {
        var h = $ (this) .height ();
        if (h> max) {
            max = h;
            índice = i;
        }
    });
    índice de retorno;
}

function onBefore (e, opta, saída, entrada, encaminhamento) {
    var h = $ (entrada) .outerHeight ();
    opts.container.animate ({height: h}, opts.autoHeightSpeed, opts.autoHeightEasing);
}

function onDestroy (e, opts) {
    if (opts._autoHeightOnResize) {
        $ (janela) .off ('redimensionar mudança de orientação', opts._autoHeightOnResize);
        opts._autoHeightOnResize = null;
    }
    opts.container.off ('ciclo-slide-adicionado ciclo-slide-removido', initAutoHeight);
    opts.container.off ('ciclo destruído', onDestroy);
    opts.container.off ('ciclo antes', onBefore);

    if (opts._sentinel) {
        opts._sentinel.remove ();
        opts._sentinel = null;
    }
}

}) (jQuery);

/ *! plugin de legenda para Cycle2; versão: 20130306 * /
(função ($) {
"use estrito";

$ .extend ($. fn.cycle.defaults, {
    legenda: '> .ciclo-legenda',
    captionTemplate: '{{slideNum}} / {{slideCount}}',
    overlay: '> .ciclo-overlay',
    overlayTemplate: '<div> {{title}} </div> <div> {{desc}} </div>',
    captionModule: 'caption'
});    

$ (document) .on ('cycle-update-view', function (e, opts, slideOpts, currSlide) {
    if (opts.captionModule! == 'caption')
        Retorna;
    var el;
    $ .each (['caption', 'overlay'], function () {
        var name = this; 
        var template = slideOpts [nome + 'Modelo'];
        var el = opts.API.getComponent (nome);
        if (el.length && template) {
            el.html (opts.API.tmpl (template, slideOpts, opts, currSlide));
            el.show ();
        }
        senão {
            el.hide ();
        }
    });
});

$ (documento) .on ('ciclo destruído', função (e, opta) {
    var el;
    $ .each (['caption', 'overlay'], function () {
        var name = this, template = opts [name + 'Template'];
        if (opta por [nome] && template) {
            el = opts.API.getComponent ('legenda');
            el.empty ();
        }
    });
});

}) (jQuery);

/ *! plugin de comando para Cycle2; versão: 20140415 * /
(função ($) {
"use estrito";

var c2 = $ .fn.cycle;

$ .fn.cycle = função (opções) {
    var cmd, cmdFn, opts;
    var args = $ .makeArray (argumentos);

    if ($ .type (options) == 'number') {
        retornar this.cycle ('goto', opções);
    }

    if ($ .type (options) == 'string') {
        return this.each (function () {
            var cmdArgs;
            cmd = opções;
            opts = $ (this) .data ('cycle.opts');

            if (opta === undefined) {
                c2.log ('a apresentação de slides deve ser inicializada antes de enviar comandos; "' + cmd + '" ignorado');
                Retorna;
            }
            senão {
                cmd = cmd == 'goto'? 'salto': cmd; // problema # 3; mude 'goto' para 'pular' internamente
                cmdFn = opts.API [cmd];
                if ($ .isFunction (cmdFn)) {
                    cmdArgs = $ .makeArray (args);
                    cmdArgs.shift ();
                    return cmdFn.apply (opts.API, cmdArgs);
                }
                senão {
                    c2.log ('comando desconhecido:', cmd);
                }
            }
        });
    }
    senão {
        return c2.apply (this, argumentos);
    }
};

// copiar adereços
$ .extend ($ .fn.cycle, c2);

$ .extend (c2.API, {
    próximo: function () {
        var opts = this.opts ();
        if (opts.busy &&! opts.manualTrump)
            Retorna;

        var count = opts.reverse? -1: 1;
        if (opts.allowWrap === false && (opts.currSlide + count)> = opts.slideCount)
            Retorna;

        opts.API.advanceSlide (contagem);
        opts.API.trigger ('ciclo seguinte', [opta]). log ('ciclo próximo');
    },

    prev: function () {
        var opts = this.opts ();
        if (opts.busy &&! opts.manualTrump)
            Retorna;
        var count = opts.reverse? 1: -1;
        if (opts.allowWrap === false && (opts.currSlide + count) <0)
            Retorna;

        opts.API.advanceSlide (contagem);
        opts.API.trigger ('cycle-prev', [opts]). log ('cycle-prev');
    },

    destruir: function () {
        this.stop (); // # 204

        var opts = this.opts ();
        var clean = $ .isFunction ($ ._ data)? $ ._ dados: $ .noop; // hackear # 184 e # 201
        clearTimeout (opts.timeoutId);
        opts.timeoutId = 0;
        opts.API.stop ();
        opts.API.trigger ('ciclo destruído', [opts]) .log ('ciclo destruído');
        opts.container.removeData ();
        limpo (opts.container [0], 'parsedAttrs', false);

        // # 75; remover estilos embutidos
        if (! opts.retainStylesOnDestroy) {
            opts.container.removeAttr ('estilo');
            opts.slides.removeAttr ('estilo');
            opts.slides.removeClass (opts.slideActiveClass);
        }
        opts.slides.each (function () {
            var slide = $ (this);
            slide.removeData ();
            slide.removeClass (opts.slideClass);
            clean (this, 'parsedAttrs', false);
        });
    },

    salto: função (índice, fx) {
        // vá para o slide solicitado
        var fwd;
        var opts = this.opts ();
        if (opts.busy &&! opts.manualTrump)
            Retorna;
        var num = parseInt (índice, 10);
        if (isNaN (num) || num <0 || num> = opts.slides.length) {
            opts.API.log ('ir para: índice de slide inválido:' + num);
            Retorna;
        }
        if (num == opts.currSlide) {
            opts.API.log ('goto: pulando, já está no slide', num);
            Retorna;
        }
        opts.nextSlide = num;
        clearTimeout (opts.timeoutId);
        opts.timeoutId = 0;
        opts.API.log ('goto:', num, '(índice zero)');
        fwd = opts.currSlide <opts.nextSlide;
        opts._tempFx = fx;
        opts.API.prepareTx (true, fwd);
    },

    stop: function () {
        var opts = this.opts ();
        var pauseObj = opts.container;
        clearTimeout (opts.timeoutId);
        opts.timeoutId = 0;
        opts.API.stopTransition ();
        if (opts.pauseOnHover) {
            if (opts.pauseOnHover! == true)
                pauseObj = $ (opts.pauseOnHover);
            pauseObj.off ('mouseenter mouseleave');
        }
        opts.API.trigger ('ciclo interrompido', [opta]). log ('ciclo interrompido');
    },

    reinit: function () {
        var opts = this.opts ();
        opts.API.destroy ();
        opts.container.cycle ();
    },

    remove: function (index) {
        var opts = this.opts ();
        var slide, slideToRemove, slides = [], slideNum = 1;
        para (var i = 0; i <opts.slides.length; i ++) {
            slide = opts.slides [i];
            if (i == index) {
                slideToRemove = slide;
            }
            senão {
                slides.push (slide);
                $ (slide) .data ('cycle.opts'). slideNum = slideNum;
                slideNum ++;
            }
        }
        if (slideToRemove) {
            opts.slides = $ (slides);
            opts.slideCount--;
            $ (slideToRemove) .remove ();
            if (index == opts.currSlide)
                opts.API.advanceSlide (1);
            else if (index <opts.currSlide)
                opts.currSlide--;
            senão
                opts.currSlide ++;

            opts.API.trigger ('ciclo-slide-removido', [opts, index, slideToRemove]). log ('ciclo-slide-removido');
            opts.API.updateView ();
        }
    }

});

// ouvir cliques em elementos com atributo data-cycle-cmd
$ (document) .on ('click.cycle', '[data-cycle-cmd]', function (e) {
    // emitir comando de ciclo
    e.preventDefault ();
    var el = $ (isto);
    comando var = el.data ('ciclo-cmd');
    var context = el.data ('ciclo-contexto') || '.ciclo-apresentação de slides';
    $ (contexto) .cycle (comando, el.data ('cycle-arg'));
});


}) (jQuery);

/ *! plugin hash para Cycle2; versão: 20130905 * /
(função ($) {
"use estrito";

$ (documento) .on ('ciclo-pré-inicializar', função (e, opta) {
    onHashChange (opta, verdadeiro);

    opts._onHashChange = function () {
        onHashChange (opta, falso);
    };

    $ (janela) .on ('hashchange', opts._onHashChange);
});

$ (document) .on ('cycle-update-view', function (e, opts, slideOpts) {
    if (slideOpts.hash && ('#' + slideOpts.hash)! = window.location.hash) {
        opts._hashFence = true;
        window.location.hash = slideOpts.hash;
    }
});

$ (documento) .on ('ciclo destruído', função (e, opta) {
    if (opts._onHashChange) {
        $ (janela) .off ('hashchange', opts._onHashChange);
    }
});

function onHashChange (opts, setStartingSlide) {
    var hash;
    if (opts._hashFence) {
        opts._hashFence = false;
        Retorna;
    }
    
    hash = window.location.hash.substring (1);

    opts.slides.each (function (i) {
        if ($ (this) .data ('cycle-hash') == hash) {
            if (setStartingSlide === true) {
                opts.startingSlide = i;
            }
            senão {
                var fwd = opts.currSlide <i;
                opts.nextSlide = i;
                opts.API.prepareTx (true, fwd);
            }
            retorna falso;
        }
    });
}

}) (jQuery);

/ *! plugin carregador para Cycle2; versão: 20131121 * /
(função ($) {
"use estrito";

$ .extend ($. fn.cycle.defaults, {
    loader: false
});

$ (documento) .on ('ciclo-bootstrap', função (e, opta) {
    var addFn;

    if (! opts.loader)
        Retorna;

    // sobrescrever API.add para esta apresentação de slides
    addFn = opts.API.add;
    opts.API.add = adicionar;

    function add (slides, prepend) {
        var slideArr = [];
        if ($ .type (slides) == 'string')
            slides = $ .trim (slides);
        else if ($ .type (slides) === 'array') {
            para (var i = 0; i <slides.length; i ++)
                slides [i] = $ (slides [i]) [0];
        }

        slides = $ (slides);
        var slideCount = slides.length;

        if (! slideCount)
            Retorna;

        slides.css ('visibility', 'hidden'). appendTo ('body'). each (function (i) {// appendTo fixes # 56
            contagem de var = 0;
            var slide = $ (this);
            var images = slide.is ('img')? slide: slide.find ('img');
            slide.data ('índice', i);
            // permite que algumas imagens sejam marcadas como sem importância (e filtre imagens sem valor src)
            images = images.filter (': not (.cycle-loader-ignore)'). filter (': not ([src = ""])');
            if (! images.length) {
                --slideCount;
                slideArr.push (slide);
                Retorna;
            }

            count = images.length;
            images.each (function () {
                // adiciona imagens que já estão carregadas
                if (this.complete) {
                    imageLoaded ();
                }
                senão {
                    $ (this) .load (function () {
                        imageLoaded ();
                    }). on ("erro", função () {
                        if (--count === 0) {
                            // ignore este slide
                            opts.API.log ('slide ignorado; img não carregado:', this.src);
                            if (--slideCount === 0 && opts.loader == 'esperar') {
                                addFn.apply (opts.API, [slideArr, prepend]);
                            }
                        }
                    });
                }
            });

            function imageLoaded () {
                if (--count === 0) {
                    --slideCount;
                    addSlide (slide);
                }
            }
        });

        if (slideCount)
            opts.container.addClass ('ciclo de carregamento');
        

        function addSlide (slide) {
            var curr;
            if (opts.loader == 'esperar') {
                slideArr.push (slide);
                if (slideCount === 0) {
                    // # 59; classificar os slides na ordem de marcação original
                    slideArr.sort (classificador);
                    addFn.apply (opts.API, [slideArr, prepend]);
                    opts.container.removeClass ('ciclo de carregamento');
                }
            }
            senão {
                curr = $ (opts.slides [opts.currSlide]);
                addFn.apply (opts.API, [slide, prepend]);
                curr.show ();
                opts.container.removeClass ('ciclo de carregamento');
            }
        }

        classificador de funções (a, b) {
            retornar a.data ('índice') - b.data ('índice');
        }
    }
});

}) (jQuery);

/ *! plugin de pager para Cycle2; versão: 20140415 * /
(função ($) {
"use estrito";

$ .extend ($. fn.cycle.defaults, {
    pager: '> .ciclo-pager',
    pagerActiveClass: 'cycle-pager-active',
    pagerEvent: 'click.cycle',
    pagerEventBubble: undefined,
    pagerTemplate: '<span> & bull; </span>'
});

$ (documento) .on ('ciclo-bootstrap', função (e, opts, API) {
    // adicionar método à API
    API.buildPagerLink = buildPagerLink;
});

$ (document) .on ('cycle-slide-added', function (e, opts, slideOpts, slideAdded) {
    if (opts.pager) {
        opts.API.buildPagerLink (opts, slideOpts, slideAdded);
        opts.API.page = page;
    }
});

$ (document) .on ('cycle-slide-removed', function (e, opts, index, slideRemoved) {
    if (opts.pager) {
        var pagers = opts.API.getComponent ('pager');
        pagers.each (function () {
            var pager = $ (este);
            $ (pager.children () [índice]) .remove ();
        });
    }
});

$ (document) .on ('cycle-update-view', function (e, opts, slideOpts) {
    var pagers;

    if (opts.pager) {
        pagers = opts.API.getComponent ('pager');
        pagers.each (function () {
           $ (this) .children (). removeClass (opts.pagerActiveClass)
            .eq (opts.currSlide) .addClass (opts.pagerActiveClass);
        });
    }
});

$ (documento) .on ('ciclo destruído', função (e, opta) {
    var pager = opts.API.getComponent ('pager');

    if (pager) {
        pager.children (). off (opts.pagerEvent); // # 202
        if (opts.pagerTemplate)
            pager.empty ();
    }
});

function buildPagerLink (opts, slideOpts, slide) {
    var pagerLink;
    var pagers = opts.API.getComponent ('pager');
    pagers.each (function () {
        var pager = $ (este);
        if (slideOpts.pagerTemplate) {
            var markup = opts.API.tmpl (slideOpts.pagerTemplate, slideOpts, opts, slide [0]);
            pagerLink = $ (marcação) .appendTo (pager);
        }
        senão {
            pagerLink = pager.children (). eq (opts.slideCount - 1);
        }
        pagerLink.on (opts.pagerEvent, function (e) {
            if (! opts.pagerEventBubble)
                e.preventDefault ();
            opts.API.page (pager, e.currentTarget);
        });
    });
}

página de função (pager, destino) {
    / * jshint validthis: true * /
    var opts = this.opts ();
    if (opts.busy &&! opts.manualTrump)
        Retorna;

    var index = pager.children (). index (target);
    var nextSlide = index;
    var fwd = opts.currSlide <nextSlide;
    if (opts.currSlide == nextSlide) {
        Retorna; // sem operação, pager clicado para o slide exibido atualmente
    }
    opts.nextSlide = nextSlide;
    opts._tempFx = opts.pagerFx;
    opts.API.prepareTx (true, fwd);
    opts.API.trigger ('ciclo-pager ativado', [opts, pager, destino]);
}

}) (jQuery);

/ *! plugin prevnext para Cycle2; versão: 20140408 * /
(função ($) {
"use estrito";

$ .extend ($. fn.cycle.defaults, {
    próximo: '> .ciclo-próximo',
    nextEvent: 'click.cycle',
    disabledClass: 'disabled',
    prev: '> .cycle-prev',
    prevEvent: 'click.cycle',
    furto: falso
});

$ (documento) .on ('inicializado por ciclo', função (e, opta) {
    opts.API.getComponent ('próximo') .on (opts.nextEvent, function (e) {
        e.preventDefault ();
        opts.API.next ();
    });

    opts.API.getComponent ('prev') .on (opts.prevEvent, function (e) {
        e.preventDefault ();
        opts.API.prev ();
    });

    if (opts.swipe) {
        var nextEvent = opts.swipeVert? 'swipeUp.cycle': 'swipeLeft.cycle swipeleft.cycle';
        var prevEvent = opts.swipeVert? 'swipeDown.cycle': 'swipeRight.cycle swiperight.cycle';
        opts.container.on (nextEvent, function (e) {
            opts._tempFx = opts.swipeFx;
            opts.API.next ();
        });
        opts.container.on (prevEvent, function () {
            opts._tempFx = opts.swipeFx;
            opts.API.prev ();
        });
    }
});

$ (document) .on ('cycle-update-view', function (e, opts, slideOpts, currSlide) {
    if (opts.allowWrap)
        Retorna;

    var cls = opts.disabledClass;
    var next = opts.API.getComponent ('next');
    var prev = opts.API.getComponent ('prev');
    var prevBoundry = opts._prevBoundry || 0;
    var nextBoundry = (opts._nextBoundry! == undefined)? opts._nextBoundry: opts.slideCount - 1;

    if (opts.currSlide == nextBoundry)
        next.addClass (cls) .prop ('desativado', verdadeiro);
    senão
        next.removeClass (cls) .prop ('desativado', falso);

    if (opts.currSlide === prevBoundry)
        prev.addClass (cls) .prop ('desativado', verdadeiro);
    senão
        prev.removeClass (cls) .prop ('desativado', falso);
});


$ (documento) .on ('ciclo destruído', função (e, opta) {
    opts.API.getComponent ('prev') .off (opts.nextEvent);
    opts.API.getComponent ('próximo') .off (opts.prevEvent);
    opts.container.off ('swipeleft.cycle swiperight.cycle swipeLeft.cycle swipeRight.cycle swipeUp.cycle swipeDown.cycle');
});

}) (jQuery);

/ *! plugin de carregamento progressivo para Cycle2; versão: 20130315 * /
(função ($) {
"use estrito";

$ .extend ($. fn.cycle.defaults, {
    progressivo: falso
});

$ (documento) .on ('ciclo-pré-inicializar', função (e, opta) {
    if (! opts.progressive)
        Retorna;

    var API = opts.API;
    var nextFn = API.next;
    var prevFn = API.prev;
    var prepareTxFn = API.prepareTx;
    var type = $ .type (opts.progressive);
    var slides, scriptEl;

    if (type == 'array') {
        slides = opts.progressive;
    }
    else if ($ .isFunction (opts.progressive)) {
        slides = opts.progressive (opts);
    }
    else if (type == 'string') {
        scriptEl = $ (opts.progressive);
        slides = $ .trim (scriptEl.html ());
        if (! slides)
            Retorna;
        // é um array json?
        if (/ ^ (\ [) /. teste (slides)) {
            tentar {
                slides = $ .parseJSON (slides);
            }
            pegar (errar) {
                API.log ('erro ao analisar slides progressivos', err);
                Retorna;
            }
        }
        senão {
            // texto simples, dividido no delimitador
            slides = slides.split (novo RegExp (scriptEl.data ('ciclo-divisão') || '\ n'));
            
            // # 95; procure pelo slide vazio
            if (! slides [slides.length - 1])
                slides.pop ();
        }
    }



    if (prepareTxFn) {
        API.prepareTx = function (manual, fwd) {
            índice de var, slide;

            if (manual || slides.length === 0) {
                prepareTxFn.apply (opts.API, [manual, fwd]);
                Retorna;
            }

            if (fwd && opts.currSlide == (opts.slideCount-1)) {
                slide = slides [0];
                slides = slides.slice (1);
                opts.container.one ('ciclo-slide-adicionado', função (e, opts) {
                    setTimeout (function () {
                        opts.API.advanceSlide (1);
                    }, 50);
                });
                opts.API.add (slide);
            }
            else if (! fwd && opts.currSlide === 0) {
                índice = slides.length-1;
                slide = slides [índice];
                slides = slides.slice (0, índice);
                opts.container.one ('ciclo-slide-adicionado', função (e, opts) {
                    setTimeout (function () {
                        opts.currSlide = 1;
                        opts.API.advanceSlide (-1);
                    }, 50);
                });
                opts.API.add (slide, true);
            }
            senão {
                prepareTxFn.apply (opts.API, [manual, fwd]);
            }
        };
    }

    if (nextFn) {
        API.next = function () {
            var opts = this.opts ();
            if (slides.length && opts.currSlide == (opts.slideCount - 1)) {
                var slide = slides [0];
                slides = slides.slice (1);
                opts.container.one ('ciclo-slide-adicionado', função (e, opts) {
                    nextFn.apply (opts.API);
                    opts.container.removeClass ('ciclo de carregamento');
                });
                opts.container.addClass ('ciclo de carregamento');
                opts.API.add (slide);
            }
            senão {
                nextFn.apply (opts.API);    
            }
        };
    }
    
    if (prevFn) {
        API.prev = function () {
            var opts = this.opts ();
            if (slides.length && opts.currSlide === 0) {
                índice var = slides.length-1;
                var slide = slides [índice];
                slides = slides.slice (0, índice);
                opts.container.one ('ciclo-slide-adicionado', função (e, opts) {
                    opts.currSlide = 1;
                    opts.API.advanceSlide (-1);
                    opts.container.removeClass ('ciclo de carregamento');
                });
                opts.container.addClass ('ciclo de carregamento');
                opts.API.add (slide, true);
            }
            senão {
                prevFn.apply (opts.API);
            }
        };
    }
});

}) (jQuery);

/ *! plugin tmpl para Cycle2; versão: 20121227 * /
(função ($) {
"use estrito";

$ .extend ($. fn.cycle.defaults, {
    tmplRegex: '{{((.)?. *?)}}'
});

$ .extend ($. fn.cycle.API, {
    tmpl: function (str, opts / *, ... * /) {
        var regex = novo RegExp (opts.tmplRegex || $ .fn.cycle.defaults.tmplRegex, 'g');
        var args = $ .makeArray (argumentos);
        args.shift ();
        return str.replace (regex, function (_, str) {
            var i, j, obj, prop, names = str.split ('.');
            para (i = 0; i <args.length; i ++) {
                obj = args [i];
                if (! obj)
                    Prosseguir;
                if (names.length> 1) {
                    prop = obj;
                    para (j = 0; j <nomes.comprimento; j ++) {
                        obj = prop;
                        prop = prop [nomes [j]] || str;
                    }
                } senão {
                    prop = obj [str];
                }

                if ($ .isFunction (prop))
                    retornar prop.apply (obj, args);
                if (prop! == undefined && prop! == null && prop! = str)
                    retorno prop;
            }
            return str;
        });
    }
});    

}) (jQuery);