$(function(){

    $("#botao").click(function(){
        let lado1 = $("#valor1").val();
        let lado2 = $("#valor2").val();
        let lado3 = $("#valor3").val();
        if(lado1<=0 || lado2<=0 || lado3<=0)
        {
            $("#resultado").text("Valores incompativeis.");
        }
        else
        {
            $("#resultado").text("O seu Triângulo é considerado " +
             tr(lado1,lado2,lado3));
        }
    })

   

    function tr (l1, l2, l3)
    {
        l1 = parseFloat(l1);
        l2 = parseFloat(l2);
        l3 = parseFloat(l3);
        if(cond_existencia_triangulo(l1, l2, l3) == true)
        {
            return classificação_triangulo(l1, l2, l3);
        }
        else
        {
            return "Triângulo não existe.";
        }
    }

    function modulo (valor)
    {
        if(valor < 0)
        {
            valor = valor * (-1);
        }
        return valor;
    }

    function cond_existencia_triangulo (l1, l2, l3)
    {
        if(modulo(l2-l3) < l1 && l1 < (l2+l3) || modulo(l1-l3) < l2 && l2
            < (l1+l3) || modulo(l1-l2) < l3 && l3 < (l1+l2))
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    function classificação_triangulo (l1, l2, l3)
    {
        if(l1 == l2 && l1 == l3 && l2 == l3)
        {
            return "Triângulo é equilátero.";
        }
        if(l1 == l2 && l1!= l3 || l2 == l3 && l2 != l
            1 || l3 == l1 && l3 != l2)
        {
            return "Triângulo é Isóceles.";
        }
        if(l1 != l2 && l1 != l3 && l3 != l2)
        {
            return "Triângulo é Escaleno.";
        }

    }
    
})