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
        $("#resultado").html("<br>Menor valor: " + mim(array) + 
            "<br> Maior valor: " + max(array) + "<br> Sem repetição: "
             + sr(array) + "<br> Ordem crescente: " + oc(array));
    })

    $("#limpar").click(function(){
        $("#resultado").text("");
        $("#texto_array").val("");
    })

    function mim (vetor)
    {
        let min;
        vetor.forEach( function(num)
        {
            if(num == Math.min(...vetor))
            {
                min = num;
            }            
        });
        return min;
    }

    function max (vetor)
    {
        let max;
        vetor.forEach( function(num)
        {
            if(num == Math.max(...vetor))
            {
                max = num;
            }            
        });
        return max;
    }

    function sr (vetor)
    {
        let vetor_sem_repeticao = [...new Set(vetor)];
        return vetor_sem_repeticao.join(",");
    }

    function oc (vetor)
    {
        return vetor.sort().join(",");
    }
})