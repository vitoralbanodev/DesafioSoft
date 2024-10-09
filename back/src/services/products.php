<?php
    require('../index.php');

    class Products{

        function createProduct($name, $amount, $price, $category){
            try {
                $sql = myPDO->prepare('INSERT INTO products (name, amount, price, category_code) VALUES (:name, :amount, :price, :category)');
                $sql->bindValue(':name', $name, PDO::PARAM_STR);
                $sql->bindValue(':amount', $amount, PDO::PARAM_INT);
                $sql->bindValue(':price', $price, PDO::PARAM_STR);
                $sql->bindValue(':category', $category);
                $sql->execute();
            } catch (PDOException $e) {
                throw new PDOException('Already exists a product named "'.$name.'"');
            }
        }

        function getProducts(){
            try {
                $queryString = "SELECT products.*, categories.tax as tax, categories.name as category_name 
                FROM products JOIN categories ON products.category_code = categories.code ORDER BY code ASC";
                $sql = myPDO->query($queryString);
                $data = $sql->fetchAll();
    
                return $data;
            } catch (Exception $e) {
                throw $e;
            }
        }

        function getSpecificSelect($column, $condition){
            try {
                $queryString = "SELECT products.*, categories.tax as tax, categories.name as category_name 
                FROM products JOIN categories ON products.category_code = categories.code WHERE $column"."="."$condition ORDER BY code ASC";
                $sql = myPDO->query($queryString);
                $data = $sql->fetchAll();
    
                return $data;
            } catch (Exception $e) {
                error_log($e->getMessage());
            }
        }

        function update($value, $code){
            try {
                $queryString = "UPDATE products SET amount = $value WHERE products.code = $code";
                $sql = myPDO->query($queryString);
                $sql->execute();
            } catch (Exception $e) {
                error_log($e->getMessage());
            }
        }
    }
?>