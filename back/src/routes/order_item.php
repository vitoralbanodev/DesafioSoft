<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

require('../services/orderItems.php');

$orderItem = new OrderItem();

$method = $_SERVER['REQUEST_METHOD'];
$jsonData = file_get_contents('php://input');
$params = json_decode($jsonData, true);

if ($method === "GET") {
    try {
        $orderList = $orderItem->getOrderItems();
        echo json_encode($orderList);
    } catch (Exception $e) {
        error_log($e->getMessage());
    }
} elseif ($method === "POST") {
    $data = $params['data'];
    if (array_key_exists("condition", $data))
        echo json_encode($orderItem->getSpecificSelect($data['column'], $data['condition']));
    else {
        try {
            $orderItem->createOrderItem($data['code'], $data['tax'], $data['price'], $data['amount'], $data['order_code']);

            echo json_encode(["success" => true]);
        } catch (Exception $e) {
            error_log($e->getMessage());
            echo json_encode(["success" => false]);
        }
    }
} elseif ($method === "DELETE") {
    methods->delete($params['rowCode'], "order_item");
}
