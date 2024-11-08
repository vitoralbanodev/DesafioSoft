<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, DELETE, PATCH");
header("Access-Control-Allow-Headers: Content-Type");

require('../services/cart.php');

$cart = new Cart();

$method = $_SERVER['REQUEST_METHOD'];
$jsonData = file_get_contents('php://input');
$params = json_decode($jsonData, true);

if ($method === "GET") {
    try {
        $CartList = $cart->getCart();

        echo json_encode($CartList);
    } catch (Exception $e) {
        error_log($e->getMessage());
    }
} elseif ($method === "POST") {
    if (array_key_exists("data", $params) && array_key_exists("condition", $params['data']))
        echo json_encode(methods->getSpecificSelect($params['data']['table'], $params['data']['column'], $params['data']['condition']));
    else {
        try {
            $cart->createProduct($params['product'], $params['amount'], $params['tax'], $params['price'], $params['total']);

            echo json_encode(["success" => true, "message" => 'A new product has been added to your cart successfully!']);
        } catch (Exception $e) {
            error_log($e->getMessage());
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }
} elseif ($method === "DELETE") {
    try {
        if ($params && array_key_exists("rowCode", $params)) {
            $product_code = $params['rowCode'];
            methods->delete($product_code, "cart");
            $response = methods->getSpecificSelect("cart", "product_code", $product_code);
            if (count($response) == 0) {
                methods->update("products", "candelete = true", "code = " . $product_code);
            }

            echo json_encode(["success" => true, "message" => 'A product has been deleted from your cart successfully!']);
        } else {
            methods->deleteAll("cart");
            echo json_encode(["success" => true, "message" => 'Your cart has been cleared successfully!']);
        }
    } catch (Exception $e) {
        error_log($e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
