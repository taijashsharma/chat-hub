package com.chat.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.chat.dto.file.FileResponseDTO;

public interface FileService {

    FileResponseDTO uploadFile(MultipartFile file,String chatId,String phoneNumber) throws IOException;

    List<FileResponseDTO> getFiles(String chatId);
}