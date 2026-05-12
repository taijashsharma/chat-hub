package com.chat.service;

import java.util.List;

import com.chat.dto.group.AddMemberDTO;
import com.chat.dto.group.GroupRequestDTO;
import com.chat.dto.group.GroupResponseDTO;

public interface GroupService {

    GroupResponseDTO createGroup(GroupRequestDTO dto, String phoneNumber);

    List<GroupResponseDTO> getUserGroups(String phoneNumber);

    GroupResponseDTO getGroup(Long groupId, String phoneNumber);

    void addMember(AddMemberDTO dto, String phoneNumber);

    void removeMember(AddMemberDTO dto, String phoneNumber);

    void leaveGroup( Long userId , String phoneNumber);

    void deleteGroup( Long userId , String phoneNumber);
}