package com.chat.utils;

import java.io.IOException;

import java.nio.file.*;

import org.springframework.stereotype.Component;

import org.springframework.web.multipart.MultipartFile;

@Component
public class FileUtil {

    private final String folderPath = "uploads/";

    public String saveFile(MultipartFile file) throws IOException {

        Path path = Paths.get(folderPath);

        if(!Files.exists(path)) {

            Files.createDirectories(path);
        }

        String fileName = System.currentTimeMillis()
                + "_"
                + file.getOriginalFilename();

        Path filePath = path.resolve(fileName);

        Files.copy(file.getInputStream(), filePath);

        return fileName;
    }
}