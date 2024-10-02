<?php
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Methods: GET, POST, DELETE");
    header("Access-Control-Allow-Headers: Content-Type");

    require('../services/categories.php');

    $categories = new Categories();

    $method = $_SERVER['REQUEST_METHOD'];
    $jsonData = file_get_contents('php://input');
    $params = json_decode($jsonData, true);

    if($method === "GET"){
        $categoryList = $categories->getCategories();
        
        echo json_encode($categoryList);
    }
    elseif($method === "POST"){
        if($params != null && array_key_exists("condition",$params)) 
            echo json_encode(methods->getSpecificSelect($params['table'], $params['column'], $params['condition']));
        else{
            $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_SPECIAL_CHARS); 
            $tax = filter_input(INPUT_POST, 'tax', FILTER_SANITIZE_NUMBER_INT);
            $categories->createCategory($name, $tax);
        }
    }
    elseif($method === "DELETE"){
        methods->delete($params['code'], $params['table']);
    }