
<?php
require('services/globalMethods.php');

$host = "pgsql_desafio";
$db = "applicationphp";
$user = "root";
$pw = "root";

define("myPDO",new PDO("pgsql:host=$host;dbname=$db", $user, $pw));
define("methods", new GlobalMethods());