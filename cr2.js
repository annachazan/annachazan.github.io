$(function()){
    $("#botao").click
    (function(){
        let sequencia = $("#valor1").val();
        let nrotacoes = $("#valor2").val();
        nrotacoes = parseInt (nrotacoes);
        $("#resultado").text("Considerando os valores informados, sua nova sequência será" +
            cr(sequência, nrotacoes));

    })

    function cr (sequencia, nrotacoes)
    {
        let array_sequencia = sequencia.split('');
        let array_letras = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
        let tam_sequencia = array_sequencia.length;
        let tam_letras = array_letras.length;
        let i;
        let array_final;
        for (i=0; i<=tam_letras; i++)
        {
            let a=0;
            if (array_sequencia[a] = array_letras[i])
            {
                array_sequencia[a] = array_letras[i+nrotacoes];

            }
            a++
        }
    }let final = array_sequencia.join('');
        return string;
}