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
        try {
            $categoryList = $categories->getCategories();
            echo json_encode($categoryList);
        } catch (Exception $e) {
            error_log($e->getMessage());
        }
    }
    elseif($method === "POST"){
        if($params != null && array_key_exists("condition",$params)) 
            echo json_encode(methods->getSpecificSelect($params['table'], $params['column'], $params['condition']));
        else{
            try {
                $categories->createCategory($params['name'], $params['tax']);
                echo json_encode(["success" => true, "message" => 'A new product has been created successfully!']);
            } catch (Exception $e) {
                error_log($e->getMessage());
                echo json_encode(['success'=> false, 'message'=>$e->getMessage()]);
            }
        }
    }
    elseif($method === "DELETE"){
        methods->delete($params['code'], "categories");
    }