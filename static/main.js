const app = Vue.createApp({
    data() {
        return {

            platos: {},
            ingredientes: [],
            busqueda: ''
        }
    },
    beforeMount() {
        const lista_ingredientes = fetch("ingredientes", { method: 'GET' });
        lista_ingredientes.then(ingredientes => ingredientes.json(), e => console.error(e)).then(
            res_ingredientes => res_ingredientes.ingredientes.forEach(ing => this.ingredientes.push(ing))).then(
                () => {
                    return fetch("busqueda", {
                        method: 'POST', headers: {
                            'Content-Type': 'application/json'
                        }, body: JSON.stringify({ 'listaIngredientes': this.ingredientes })
                    }).then(res => res.json(), e => console.error(e.message)).then(res => this.platos = res);
                })
        console.log("ingredientes", this.ingredientes)
        /*const serverResponse = fetch("busqueda", {method:"POST", headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          }, body:JSON.stringify({'listaIngredientes': this.ingredientes})});
        serverResponse.then(res => res.json(), e => console.log(e.message)).then(text => {this.platos = text});*/
    },
    methods: {
        writeSpeechWords() {
            console.log("words", this.words)
            var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
            var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
            var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

            //let ingredientes = [ 'arroz' , 'tomate' , 'huevo', 'pollo', 'ternera', 'patatas', 'jamón', 'guisantes', 'merluza'];
            let ingredientes = this.ingredientes;
            let grammar = '#JSGF V1.0; grammar ingredientes; public <ingrediente> = ' + ingredientes.join(' | ') + ' ;'

            var recognition = new SpeechRecognition();
            var speechRecognitionList = new SpeechGrammarList();

            speechRecognitionList.addFromString(grammar, 1);

            recognition.grammars = speechRecognitionList;
            recognition.continuous = false;
            recognition.lang = 'es-ES';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            //let diagnostic = document.querySelector('.output');

            //var hints = document.querySelector('.hints');

            recognition.onresult = (event) => {
                let palabras = event.results[0][0].transcript;
                let lista_palabras = palabras.toLowerCase().split(/,| /).map(palabra => palabra.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ""));
                let lista_ingredientes = lista_palabras.filter(palabra => ingredientes.includes(palabra));
                console.log(lista_ingredientes);
                this.words = lista_ingredientes;
                const serverResponse = fetch("busqueda", {
                    method: "POST", headers: {
                        'Content-Type': 'application/json'
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                    }, body: JSON.stringify({ 'listaIngredientes': lista_ingredientes })
                });
                serverResponse.then(res => res.json()).then(text => { this.platos = text });
            }


            recognition.start();

        },
        writeFromText() {
            let ingredientes = this.ingredientes;
            let palabras = this.busqueda;
            let lista_palabras = palabras.toLowerCase().split(/,| /).map(palabra => palabra.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ""));
            let lista_ingredientes = lista_palabras.filter(palabra => ingredientes.includes(palabra));
            console.log(lista_ingredientes);
            const serverResponse = fetch("busqueda", {
                method: "POST", headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                }, body: JSON.stringify({ 'listaIngredientes': lista_ingredientes })
            });
            serverResponse.then(res => res.json()).then(text => { this.platos = text });
        }
    }
})