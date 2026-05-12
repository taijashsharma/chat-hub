package com.chat.dto.file;

import java.time.LocalDateTime;

import com.chat.enums.FileType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FileResponseDTO {

    private Long id;
    private String fileName;
    private FileType fileType;
    private String fileUrl;
    private String chatId;
    private Long senderId;
    private LocalDateTime createdAt;
}