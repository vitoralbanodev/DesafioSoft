<?php
    require('../index.php');

    class OrderItem
    {

        function createOrderItem($pcode, $tax, $price, $amount, $ocode){
            try {
                $sql = myPDO->prepare('INSERT INTO ORDER_ITEM (order_code, product_code, amount, price, tax) VALUES (:ocode, :pcode, :amount, :price, :tax)');
                $sql->bindValue(':ocode', $ocode);
                $sql->bindValue(':pcode', $pcode);
                $sql->bindValue(':amount', $amount);
                $sql->bindValue(':price', $price);
                $sql->bindValue(':tax', $tax);
                $sql->execute();
                methods->update("products", "candelete = false", "products.code = ".$pcode);
            } catch (Exception $e) {
                throw $e;
            }
        }

        function getSpecificSelect($column, $condition){
            $queryString = "SELECT oi.*, p.category_code, p.name as product_name, c.name as category_name 
                FROM order_item oi JOIN products p ON oi.product_code = p.code JOIN categories c ON p.category_code = c.code 
                WHERE $column"."="."$condition ORDER BY code ASC";
            $sql = myPDO->query($queryString);
            $data = $sql->fetchAll();

            return $data;
        }

        function getOrderItems(){
            $sql = myPDO->query("SELECT * FROM ORDER_ITEM");
            $data = $sql->fetch();

            return $data;
        }

        function delete($code){
            $sql = myPDO->prepare("DELETE FROM order_item WHERE order_code = $code");
            $sql->execute();
        }
    }
?>