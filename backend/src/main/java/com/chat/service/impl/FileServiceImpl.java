package com.chat.service.impl;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.chat.dto.file.FileResponseDTO;
import com.chat.entity.Attachment;
import com.chat.entity.ChatRoom;
import com.chat.entity.User;
import com.chat.enums.FileType;
import com.chat.repository.AttachmentRepository;
import com.chat.repository.ChatRoomRepository;
import com.chat.repository.UserRepository;
import com.chat.service.FileService;
import com.chat.utils.FileUtil;

import lombok.RequiredArgsConstructor;

@Service

@RequiredArgsConstructor

public class FileServiceImpl implements FileService {

    private final AttachmentRepository attachmentRepository;

    private final FileUtil fileUtil;

    private final UserRepository userRepository; 

    private final ChatRoomRepository chatRoomRepository; // ADD

    private void validateUserInChat(String chatId, Long userId) {

        ChatRoom chat = chatRoomRepository.findByChatId(chatId)
                .orElseThrow();

        if (!chat.getUser1().getId().equals(userId) &&
            !chat.getUser2().getId().equals(userId)) {

            throw new RuntimeException("Unauthorized");
        }
    }

    @Override
    public FileResponseDTO uploadFile(
            MultipartFile file,
            String chatId,
            String phoneNumber
    ) throws IOException {
        User user = userRepository
        .findByPhoneNumber(phoneNumber)
        .orElseThrow(() -> new RuntimeException("User not found"));
        validateUserInChat(chatId, user.getId());

        FileType fileType = detectType(file.getContentType());

        String fileName = fileUtil.saveFile(file);

        Attachment attachment = Attachment.builder()
                .fileName(fileName)
                .fileType(fileType)
                .fileUrl("/uploads/" + fileName)
                .chatId(chatId)
                .senderId(user.getId()) 
                .createdAt(LocalDateTime.now())
                .build();

        Attachment saved = attachmentRepository.save(attachment);

        return map(saved);
    }

    @Override
    public List<FileResponseDTO> getFiles(String chatId) {

        return attachmentRepository

                .findByChatId(chatId)

                .stream()

                .map(this::map)

                .collect(Collectors.toList());
    }

    private FileType detectType(String contentType){

        if(contentType == null)
            return FileType.DOCUMENT;
    
        contentType = contentType.toLowerCase();
    
        if(contentType.contains("image"))
            return FileType.IMAGE;
    
        if(contentType.contains("video"))
            return FileType.VIDEO;
    
        if(contentType.contains("audio"))
            return FileType.AUDIO;
    
        if(contentType.contains("pdf"))
            return FileType.DOCUMENT;
    
        if(contentType.contains("msword"))
            return FileType.DOCUMENT;
    
        if(contentType.contains("officedocument"))
            return FileType.DOCUMENT;
    
        return FileType.DOCUMENT;
    }

    private FileResponseDTO map(Attachment a){

        return FileResponseDTO.builder()

                .id(a.getId())

                .fileName(a.getFileName())

                .fileType(a.getFileType())

                .fileUrl(a.getFileUrl())

                .chatId(a.getChatId())

                .senderId(a.getSenderId())

                .createdAt(a.getCreatedAt()) 

                .build();
    }
}