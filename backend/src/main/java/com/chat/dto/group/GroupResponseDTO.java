package com.chat.dto.group;

import java.util.List;

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
public class GroupResponseDTO {

    private Long groupId;

    private String name;

    private String description;

    private String groupImage;

    private Long createdBy;

    private String chatId;

    private List<Long> members;
}