<?php
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Methods: GET, POST, DELETE");
    header("Access-Control-Allow-Headers: Content-Type");

    require('../services/order.php');

    $order = new Order();

    $method = $_SERVER['REQUEST_METHOD'];
    $jsonData = file_get_contents('php://input');
    $params = json_decode($jsonData, true);
    
    if($method === "GET"){
        try{
            $orderList = $order->getOrders();
            echo json_encode($orderList);
        } catch (Exception $e) {
            error_log($e->getMessage());
        }
    }
    elseif($method === "POST"){
        if($params != null && array_key_exists("condition", $params)) 
            echo json_encode(methods->getSpecificSelect($params['column'], $params['condition']));
        else{
            try {
                $order->createOrder($params['total'], $params['tax'], $params['date'], $params['quantity']);
                echo json_encode(["success" => true, "message" => 'Your order has been placed successfully!', "order" => $order->getLastOrder()]);
            } catch (PDOException $e) {
                error_log($e->getMessage());
                echo json_encode(['success'=> false, 'message'=>$e->getMessage()]);
            }
        }
    }
    elseif($method === "DELETE"){
        if($params != null && array_key_exists("code", $params)){
            $order->deleteOrders($params['code']);
        }
        else{
            methods->deleteAll("order_item");
            methods->deleteAll("orders");
        }
    }