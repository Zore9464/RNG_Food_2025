-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: rng_food
-- ------------------------------------------------------
-- Server version	9.5.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--



--
-- Table structure for table `store`
--

DROP TABLE IF EXISTS `store`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store` (
  `store_id` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(45) NOT NULL,
  `address` varchar(100) NOT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `rating` decimal(3,1) DEFAULT NULL,
  PRIMARY KEY (`store_id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store`
--

LOCK TABLES `store` WRITE;
/*!40000 ALTER TABLE `store` DISABLE KEYS */;
INSERT INTO `store` VALUES (1,'Q Burger','220新北市板橋區四川路二段121號1樓',24.99439360,121.45121590,4.0),(2,'舒肥底家','220新北市板橋區四川路二段99-1號',24.99479187,121.45256660,3.9),(3,'黃記小吃','220新北市板橋區四川路二段99-3號',24.99459122,121.45247970,4.7),(4,'避楓棠 私藏酒食','220新北市板橋區四川路二段93號',24.99488674,121.45284220,4.7),(5,'饅頭小村 手工包子饅頭','220新北市板橋區四川路二段85號',24.99497602,121.45301020,4.7),(6,'丸川烏龍麵','220新北市板橋區四川路二段83號',24.99493834,121.45303180,4.7),(7,'韓金智能拉麵店','220新北市板橋區四川路二段63號',24.99514732,121.45348980,4.8),(8,'原滷味','220新北市板橋區德興街6號',24.99489994,121.45329550,3.0),(9,'喜餃俱樂部','220新北市板橋區德興街6號',24.99493886,121.45333280,4.4),(10,'永亨蒜味鹹酥雞','220新北市板橋區德興街10號',24.99480509,121.45334850,4.4),(11,'拉亞漢堡','220新北市板橋區德興街3號',24.99493235,121.45345120,3.7),(12,'上海小吃 煎餅菓子','220新北市板橋區德興街5號',24.99483257,121.45345120,4.5),(13,'呷の堡','220新北市板橋區四川路二段81巷',24.99477657,121.45348810,3.4),(14,'甲霸緊睏','220新北市板橋區德興街12號',24.99468082,121.45329950,4.9),(15,'蒸手工小籠包','220新北市板橋區德興街13號',24.99459182,121.45344130,4.0),(16,'向陽晨間飲食館二館','220新北市板橋區四川路二段47巷4弄17號',24.99454167,121.45351040,4.2),(17,'熊愛飯丸','220新北市板橋區德興街17號 No',24.99447582,121.45342980,4.9),(18,'柴田家炒泡麵専売店','220新北市板橋區四川路二段99巷13號１樓',24.99449372,121.45312050,4.8),(19,'享時雞肉飯','220新北市板橋區四川路二段99巷4弄7號',24.99423847,121.45293310,4.3),(20,'食月午日 Brunch & Cafe','220新北市板橋區四川路二段99巷4弄3號',24.99419212,121.45308650,4.2),(21,'蒹葭油飯工作室','22061新北市板橋區四川路二段99巷4弄5號',24.99405542,121.45284590,4.9),(22,'18度C麻醬現做涼麵','220新北市板橋區德興街21號',24.99429134,121.45347930,4.0),(23,'煮鍋燒','220新北市板橋區四川路二段47巷4弄15號',24.99443038,121.45360080,4.6),(24,'古意人麵疙瘩','22061新北市板橋區四川路二段47巷4弄13號1樓',24.99446647,121.45378390,4.4),(25,'雪城麻辣燙','220新北市板橋區四川路二段47巷4弄8號',24.99475627,121.45381330,4.5),(26,'粩泰泰 泰式料理','220新北市板橋區四川路二段47巷4弄6號',24.99479247,121.45396200,4.1),(27,'壹咖啡','220新北市板橋區四川路二段47巷4弄3號',24.99571785,121.45427950,4.0),(28,'板橋北方牛肉麵','220新北市板橋區四川路二段47巷4弄4號',24.99489659,121.45405570,4.5),(29,'倫記餛飩麵','220新北市板橋區四川路二段47巷2弄4號',24.99522098,121.45374810,4.7),(30,'食饕園','220新北市板橋區四川路二段47巷2弄2號',24.99527457,121.45395540,4.3);
/*!40000 ALTER TABLE `store` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store_style_map`
--

DROP TABLE IF EXISTS `store_style_map`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_style_map` (
  `store_id` int NOT NULL,
  `style_id` int NOT NULL,
  PRIMARY KEY (`store_id`,`style_id`),
  KEY `style_id` (`style_id`),
  CONSTRAINT `store_style_map_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `store` (`store_id`),
  CONSTRAINT `store_style_map_ibfk_2` FOREIGN KEY (`style_id`) REFERENCES `style` (`style_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_style_map`
--

LOCK TABLES `store_style_map` WRITE;
/*!40000 ALTER TABLE `store_style_map` DISABLE KEYS */;
INSERT INTO `store_style_map` VALUES (1,1),(5,1),(7,1),(11,1),(13,1),(15,1),(16,1),(17,1),(20,1),(22,1),(27,1),(30,1),(1,2),(2,2),(3,2),(5,2),(6,2),(7,2),(9,2),(11,2),(12,2),(13,2),(15,2),(16,2),(17,2),(18,2),(19,2),(20,2),(21,2),(22,2),(23,2),(24,2),(25,2),(26,2),(27,2),(28,2),(29,2),(30,2),(2,3),(3,3),(4,3),(6,3),(7,3),(8,3),(9,3),(14,3),(18,3),(19,3),(22,3),(23,3),(25,3),(26,3),(28,3),(29,3),(30,3),(4,4),(7,4),(8,4),(14,4),(2,5),(19,6),(3,7),(8,7),(10,7),(12,7),(14,7),(15,7),(21,7),(22,7),(24,7),(30,7),(4,8),(3,9),(5,9),(8,9),(9,9),(10,9),(12,9),(13,9),(14,9),(15,9),(16,9),(17,9),(18,9),(19,9),(20,9),(21,9),(22,9),(23,9),(24,9),(25,9),(28,9),(29,9),(30,9),(2,10),(3,10),(6,10),(11,10),(16,10),(17,10),(19,10),(21,10),(26,10),(3,11),(6,11),(7,11),(11,11),(18,11),(22,11),(23,11),(24,11),(25,11),(26,11),(28,11),(29,11),(7,13),(26,14),(9,15),(11,16),(20,16),(27,17);
/*!40000 ALTER TABLE `store_style_map` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `style`
--

DROP TABLE IF EXISTS `style`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `style` (
  `style_id` int NOT NULL,
  `style_name` varchar(45) NOT NULL,
  PRIMARY KEY (`style_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `style`
--

LOCK TABLES `style` WRITE;
/*!40000 ALTER TABLE `style` DISABLE KEYS */;
INSERT INTO `style` VALUES (1,'早餐'),(2,'午餐'),(3,'晚餐'),(4,'宵夜'),(5,'健康餐盒'),(6,'便當'),(7,'小吃'),(8,'餐酒館'),(9,'中式'),(10,'飯食'),(11,'麵食'),(12,'日式'),(13,'韓式'),(14,'異國料理'),(15,'素食'),(16,'速食'),(17,'飲品');
/*!40000 ALTER TABLE `style` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` varchar(10) NOT NULL,
  `password` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-27 17:48:31
