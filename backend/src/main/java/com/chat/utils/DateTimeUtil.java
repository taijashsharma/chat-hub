package com.chat.utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class DateTimeUtil {

    private static final DateTimeFormatter formatter =

            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public static String format(LocalDateTime time){

        return time.format(formatter);
    }

    public static LocalDateTime now(){

        return LocalDateTime.now();
    }
}