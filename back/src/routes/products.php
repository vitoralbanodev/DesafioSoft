<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, DELETE, PATCH");
header("Access-Control-Allow-Headers: Content-Type");

require('../services/products.php');

$products = new Products();

$method = $_SERVER['REQUEST_METHOD'];
$jsonData = file_get_contents('php://input');
$params = json_decode($jsonData, true);

if ($method === "GET") {
    try {
        $categoryList = $products->getProducts();

        echo json_encode($categoryList);
    } catch (Exception $e) {
        error_log($e->getMessage());
    }
} elseif ($method === "POST") {

    if (array_key_exists("data", $params) && array_key_exists("condition", $params['data']))
        echo json_encode($products->getSpecificSelect($params['data']['column'], $params['data']['condition']));
    else {
        try {
            $products->createProduct(strtoupper($params['name']), $params['amount'], $params['price'], $params['category']);

            echo json_encode(["success" => true, "message" => 'A new product has been created successfully!']);
        } catch (PDOException $e) {
            error_log($e->getMessage());
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }
} elseif ($method === "DELETE") {
    try {
        $category_code = $params['auxCode'];
        methods->delete($params['rowCode'], "products");
        $response = methods->getSpecificSelect("products", "category_code", $category_code);
        if (count($response) == 0) {
            methods->update("categories", "candelete = true", "categories.code = " . $category_code);
        }
        echo json_encode(["success" => true, "message" => 'A product has been deleted successfully!']);
    } catch (Exception $e) {
        error_log($e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
} elseif ($method === "PATCH") {
    methods->update("products", $params['value'], ("products.code = " . $params['code']));
}
