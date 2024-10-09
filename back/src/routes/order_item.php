<?php
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Methods: GET, POST, DELETE");
    header("Access-Control-Allow-Headers: Content-Type");

    require('../services/orderItems.php');

    $orderItem = new OrderItem();

    $method = $_SERVER['REQUEST_METHOD'];
    $jsonData = file_get_contents('php://input');
    $params = json_decode($jsonData, true);
    
    if($method === "GET"){
        try{
            $orderList = $orderItem->getOrderItems();
            echo json_encode($orderList);
        } catch (Exception $e) {
            error_log($e->getMessage());
        }
    }
    elseif($method === "POST"){
        if($params != null && array_key_exists("condition", $params)) 
            echo json_encode($orderItem->getSpecificSelect($params['column'], $params['condition']));
        else{
            try {
                $orderItem->createOrderItem($params['code'], $params['tax'], $params['price'], $params['amount'], $params['order_code']);

                echo json_encode(["success" => true]);
            } catch (Exception $e) {
                error_log($e->getMessage());
                echo json_encode(["success" => false]);
            }
        }
    }
    elseif($method === "DELETE"){
        methods->delete($params['code'], "order_item");
    }