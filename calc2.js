$(function(){

    $("#botao").click(function(){
        let valor1 = $("#valor1").val();
        let valor2 = $("#valor2").val();
        let operacao = $("#ope").val();
        $("#resultado").text("O valor da sua operação é = " + ca(valor1,valor2,operacao));
    })


    function ca (x, y, z)
    {
        x = parseFloat(x);
        y = parseFloat(y);
        
        switch(z)
        {
            case "Soma": return x + y; break;
            case "Subtração": return x - y; break;
            case "Multiplicação": return x * y ; break;
            case "Divisão": return x/y; break;
        }
    }

    
})