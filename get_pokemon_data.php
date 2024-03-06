<?php

if (isset($_POST['ids'])) { //O código só executará caso haja a requisição POST

    $pokemonIds = $_POST['ids']; //Atribuindo os ids digitados pelo usuário

    $pokemonsData = array(); //Criando um array para a informação de cada pokemon


    $curl = curl_init(); //Iniciando o cURL

    foreach ($pokemonIds as $id) {
        curl_setopt_array($curl, array( //Configurando o cUrl para consumir a api
            CURLOPT_URL => "https://pokeapi.co/api/v2/pokemon/$id",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => 'GET'
        ));

        $response = curl_exec($curl); //Recebendo o JSON da api
        $decodedResponse = json_decode($response, true); //Transformando o JSON da api em um array associativo
        array_push($pokemonsData, $decodedResponse); //Adicionando o array associativo ao array de informações de cada pokemon
    }

    curl_close($curl); //Fechando a conexão cURL

    $jsonData = json_encode($pokemonsData); //Codificando o array de pokemons para JSON

    header('Content-Type: application/json'); //Definindo o tipo de informação a ser enviada

    echo ($jsonData); //Enviando o JSON de volta
}
