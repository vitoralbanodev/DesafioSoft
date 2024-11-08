<?php
class GlobalMethods
{

    function getSpecificSelect($table, $column, $condition)
    {
        $queryString = "SELECT * FROM $table WHERE $column" . "=" . "$condition";
        $sql = myPDO->query($queryString);
        $data = $sql->fetchAll();

        return $data;
    }

    function delete($code, $table)
    {
        try {
            $sql = myPDO->prepare("DELETE FROM $table WHERE code = $code");
            $sql->execute();
        } catch (Exception $e) {
            throw new PDOException("It was not possible to delete this item!");
        }
    }

    function deleteAll($table)
    {
        try {
            $sql = myPDO->prepare("DELETE FROM $table");
            $sql->execute();
        } catch (Exception $e) {
            throw new PDOException("It was not possible to delete this items!");
        }
    }

    function update($table, $values, $condition)
    {
        try {
            $queryString = "UPDATE $table SET $values WHERE $condition";
            $sql = myPDO->query($queryString);
            $sql->execute();
        } catch (Exception $e) {
            error_log($e->getMessage());
        }
    }
}
