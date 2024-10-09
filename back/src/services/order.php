<?php
    require('../index.php');

    class Order
    {

        function createOrder($total, $tax, $date, $qtd){
            try {
                $sql = myPDO->prepare('INSERT INTO orders (total, tax, quantity, purchase_date) VALUES (:total, :tax, :quantity ,:date)');
                $sql->bindValue(':total', $total, PDO::PARAM_STR);
                $sql->bindValue(':tax', $tax, PDO::PARAM_INT);
                $sql->bindValue(':quantity', $qtd, PDO::PARAM_INT);
                $sql->bindValue(':date', $date, PDO::PARAM_STR);
                $sql->execute();
            } catch (PDOException $e) {
                throw new PDOException('Unable to make a new request '. $e->getMessage());
            } catch (Exception $e) {
                throw $e;
            }
        }

        function getOrders(){
            try{
                $sql = myPDO->query("SELECT * FROM orders ORDER BY code ASC");
                $data = $sql->fetchAll();
    
                return $data;
            } catch (Exception $e) {
                throw $e;
            }
        }

        function getLastOrder(){
            try{
                $sql = myPDO->query("SELECT * FROM orders ORDER BY code DESC");
                $data = $sql->fetch();
    
                return $data;
            } catch (Exception $e) {
                throw $e;
            }
        }

        function deleteOrders($code){
            $sql = myPDO->prepare("DELETE FROM order_item WHERE order_code = $code");
            $sql->execute();
            $sql = myPDO->prepare("DELETE FROM orders WHERE code = $code");
            $sql->execute();
        }
    }
?>