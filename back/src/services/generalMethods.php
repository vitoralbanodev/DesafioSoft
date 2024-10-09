<?php
    class GeneralMethods{
        function generateCode($table){
            $lastCode = $this->getLastCode($table);
            $lastCode++;
            return $lastCode;
        }

        function getLastCode($table){
            $sql = myPDO->query("SELECT code FROM $table ORDER BY code DESC LIMIT 1");
            $data = $sql->fetch();

            return (int)$data[0];
        }

        function getSpecificSelect($table, $column, $condition){
            $queryString = "SELECT * FROM $table WHERE $column"."="."$condition";
            $sql = myPDO->query($queryString);
            $data = $sql->fetchAll();

            return $data;
        }

        function delete($code, $table){
            $sql = myPDO->prepare("DELETE FROM $table WHERE code = $code");
            $sql->execute();
        }

        function deleteAll($table){
            $sql = myPDO->prepare("DELETE FROM $table");
            $sql->execute();
        }
    }
?>