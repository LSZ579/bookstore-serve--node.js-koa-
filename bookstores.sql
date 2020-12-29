/*
Navicat MySQL Data Transfer

Source Server         : root
Source Server Version : 50726
Source Host           : localhost:3306
Source Database       : bookstore

Target Server Type    : MYSQL
Target Server Version : 50726
File Encoding         : 65001

Date: 2020-12-29 15:08:11
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for address
-- ----------------------------
DROP TABLE IF EXISTS `address`;
CREATE TABLE `address` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userID` int(11) DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `sex` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `about` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `code` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `detail` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `phone` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `createTime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for book
-- ----------------------------
DROP TABLE IF EXISTS `book`;
CREATE TABLE `book` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `book_name` varchar(255) DEFAULT NULL,
  `ISBN` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL COMMENT '所属的用户',
  `author` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT NULL COMMENT '状态1是已借出，2未借出，3不可借出，4为删除',
  `img_url` varchar(255) DEFAULT NULL COMMENT '封面',
  `desc` varchar(600) DEFAULT NULL COMMENT '描述',
  `delete` varchar(11) DEFAULT '0' COMMENT '1为删除，0正常',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for lend
-- ----------------------------
DROP TABLE IF EXISTS `lend`;
CREATE TABLE `lend` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `book_id` int(11) DEFAULT NULL COMMENT '图书id',
  `owner_id` int(11) DEFAULT NULL COMMENT '图书拥有者',
  `lend_id` int(11) DEFAULT NULL COMMENT '借阅者',
  `status` int(11) NOT NULL COMMENT '状态，1是提交审核，2是审核通过，3是拒绝借阅，订单完成',
  `delete` int(11) DEFAULT NULL COMMENT '0正常，1删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 ROW_FORMAT=FIXED;

-- ----------------------------
-- Table structure for order
-- ----------------------------
DROP TABLE IF EXISTS `order`;
CREATE TABLE `order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `book_id` int(11) DEFAULT NULL,
  `lend_userId` int(11) DEFAULT NULL COMMENT '借书者id',
  `user_id` int(11) DEFAULT NULL COMMENT '拥有者id',
  `book_name` varchar(255) DEFAULT NULL COMMENT '图书名',
  `address` varchar(255) DEFAULT NULL COMMENT '邮寄的地址',
  `tell` varchar(255) DEFAULT NULL COMMENT '联系号码',
  `name` varchar(255) DEFAULT NULL COMMENT '姓名',
  `sex` varchar(255) DEFAULT NULL COMMENT '性别',
  `status` varchar(255) DEFAULT NULL COMMENT '状态0提交申请审核中，1同意借书，2拒绝借书，3确认还书',
  `lend_remark` varchar(500) DEFAULT '0' COMMENT '借书者备注',
  `remask` varchar(2000) DEFAULT NULL COMMENT '拥有人回复借书的，留言，以Json形式',
  `isReslove` varchar(255) DEFAULT '0',
  `apply_time` varchar(255) DEFAULT NULL,
  `review_time` varchar(255) DEFAULT NULL,
  `isback` varchar(255) DEFAULT '0',
  `back_time` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'id',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'ÓÃ»§Ãû×Ö',
  `account` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'ÕËºÅ',
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'ÃÜÂë',
  `avatar` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'Í·Ïñ',
  `phone` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'ÊÖ»úºÅÂë',
  `type` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '1£ºÆÕÍ¨ÓÃ»§£¬2£ºÉÌ¼Ò',
  `score` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'ÅäËÍÔ±ÆÀ·Ö',
  `solt` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;
