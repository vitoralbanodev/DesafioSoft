<?php
    require('../index.php');

    class Categories{

        function createCategory($name, $tax){
            error_log("create category");
            try {
                $sql = myPDO->prepare('INSERT INTO categories (name, tax, candelete) VALUES (:name, :tax, true)');
                $sql->bindValue(':name', $name, PDO::PARAM_STR);
                $sql->bindValue(':tax', $tax, PDO::PARAM_STR);
                $sql->execute();
            } catch (PDOException $e) {
                throw new PDOException('Already exists a category named "'.$name.'"');
            }
        }

        function getCategories(){
            try{
                $queryString = "SELECT * FROM categories ORDER BY code ASC";
                $sql = myPDO->query($queryString);
                $data = $sql->fetchAll();
                
                return $data;
            } catch (Exception $e) {
                throw $e;
            }
        }
    }
?>