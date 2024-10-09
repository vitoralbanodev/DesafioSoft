<?php
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Methods: GET, POST, DELETE, PATCH");
    header("Access-Control-Allow-Headers: Content-Type");

    require('../services/products.php');

    $products = new Products();

    $method = $_SERVER['REQUEST_METHOD'];
    $jsonData = file_get_contents('php://input');
    $params = json_decode($jsonData, true);
    
    if($method === "GET"){
        try {
            $categoryList = $products->getProducts();
    
            echo json_encode($categoryList);
        } catch (Exception $e) {
            error_log($e->getMessage());
        }
    }
    elseif($method === "POST"){
        if($params != null && array_key_exists("condition", $params)) 
            echo json_encode($products->getSpecificSelect($params['column'], $params['condition']));
        else{
            try {
                $products->createProduct($params['name'], $params['amount'], $params['price'], $params['category']);

                echo json_encode(["success" => true, "message" => 'A new product has been created successfully!']);
            } catch (PDOException $e) {
                error_log($e->getMessage());
                http_response_code(500);
                echo json_encode(['success'=> false, 'message'=>$e->getMessage()]);
            }
        }
    }
    elseif($method === "DELETE"){
        methods->delete($params['code'], "products");
    }
    elseif($method === "PATCH"){
        $products->update($params['value'], $params['code']);
    }