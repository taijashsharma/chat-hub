package com.chat.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.chat.dto.file.FileResponseDTO;
import com.chat.service.FileService;

import lombok.RequiredArgsConstructor;

@RestController

@RequestMapping("/api/file")

@RequiredArgsConstructor

public class FileController {

    private final FileService fileService;

    @PostMapping("/upload")

    public ResponseEntity<FileResponseDTO>

    upload(

            @RequestParam MultipartFile file,

            @RequestParam String chatId,

            Authentication auth

    ) throws IOException {

        return ResponseEntity.ok(

                fileService.uploadFile(

                        file,

                        chatId,

                        auth.getName()
                )
        );
    }

    @GetMapping("/{chatId}")

    public ResponseEntity<List<FileResponseDTO>>

    getFiles(

            @PathVariable String chatId

    ) {

        return ResponseEntity.ok(

                fileService.getFiles(chatId)
        );
    }
}