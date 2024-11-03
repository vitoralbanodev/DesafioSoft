<?php
require('../index.php');

class Cart
{

    function createProduct($product, $amount, $price, $tax)
    {
        try {
            $sql = myPDO->prepare('INSERT INTO cart (product_code, amount, price, tax) VALUES (:product_code, :amount, :price, :tax)');
            $sql->bindValue(':product_code', $product, PDO::PARAM_INT);
            $sql->bindValue(':amount', $amount, PDO::PARAM_INT);
            $sql->bindValue(':price', $price, PDO::PARAM_STR);
            $sql->bindValue(':tax', $tax, PDO::PARAM_STR);
            $sql->execute();
            methods->update("products", "candelete = false", "code = " . $product);
        } catch (Exception $e) {
            throw new PDOException($e->getMessage());
        }
    }

    function getCart()
    {
        try {
            $queryString = "SELECT C.*, P.NAME as name FROM cart C JOIN PRODUCTS P ON C.PRODUCT_CODE = P.CODE ORDER BY code ASC";
            $sql = myPDO->query($queryString);
            $data = $sql->fetchAll();

            return $data;
        } catch (Exception $e) {
            throw $e;
        }
    }
}
