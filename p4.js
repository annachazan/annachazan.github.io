$(function(){

    $("#botao").click(function(){
        let texto_array = $("#texto_array").val();
        texto_array = texto_array.replace(/\s+/g, '');
        let array = texto_array.split(",");
        let tam = array.length;
        if(array[tam-1] == "")
        {
            array.pop();
        }
        $("#resultado").html("<br>Multiplicados por dois: " + vezesdois(array)
         + "<br> Pares: " + par(array) + "<br> Soma de todos: " + soma(array));
    })

    $("#limpar").click(function(){
        $("#resultado").text("");
        $("#texto_array").val("");
    })

    function vezesdois (vetor)
    {
        let x = vetor.map(function(num)
        {
            return num*2;
        })
        return x;
    }

    function par (vetor)
    {
        let x = vetor.filter(function(num)
        {
            return num%2==0;
        })
        if(x == "")
        {
            return "Não há valores pares."
        }
        else
        {
            return x;
        }
    }

    function soma (vetor)
    {
        let x = vetor.reduce(function(soma, num)
        {
            return parseInt(soma) + parseInt(num);
        });
        return x;
    }

})