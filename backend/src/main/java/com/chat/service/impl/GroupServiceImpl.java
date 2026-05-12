package com.chat.service.impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.chat.dto.group.AddMemberDTO;
import com.chat.dto.group.GroupRequestDTO;
import com.chat.dto.group.GroupResponseDTO;
import com.chat.entity.Group;
import com.chat.entity.GroupMember;
import com.chat.entity.User;
import com.chat.repository.GroupMemberRepository;
import com.chat.repository.GroupRepository;
import com.chat.repository.UserRepository;
import com.chat.service.GroupService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GroupServiceImpl implements GroupService {

        private final UserRepository userRepository;

    private final GroupRepository groupRepository;

    private final GroupMemberRepository groupMemberRepository;

        @Override
        public GroupResponseDTO createGroup(GroupRequestDTO dto, String phone) {
        
            User creator = userRepository
                    .findByPhoneNumber(phone)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        
            Group group = Group.builder()
                    .name(dto.getName())
                    .description(dto.getDescription())
                    .groupImage(dto.getGroupImage())
                    .createdBy(creator.getId()) 
                    .chatId(UUID.randomUUID().toString())
                    .build();
        
            Group savedGroup = groupRepository.save(group);
        
            GroupMember creatorMember = GroupMember.builder()
                    .groupId(savedGroup.getId())
                    .userId(creator.getId()) 
                    .admin(true)
                    .build();
        
            groupMemberRepository.save(creatorMember);
        
            if (dto.getMembers() != null) {
                for (Long userId : dto.getMembers()) {
            
                    if (userId.equals(creator.getId())) continue; // 🔥 skip self
            
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found"));
            
                    if (!groupMemberRepository.existsByGroupIdAndUserId(savedGroup.getId(), userId)) {
            
                        GroupMember member = GroupMember.builder()
                                .groupId(savedGroup.getId())
                                .userId(user.getId())
                                .admin(false)
                                .build();
            
                        groupMemberRepository.save(member);
                    }
                }
            }
    
            return getGroup(savedGroup.getId(), phone);
        }

    @Override
    public List<GroupResponseDTO> getUserGroups(String phoneNumber) {
    
        User user = userRepository
                .findByPhoneNumber(phoneNumber)
                .orElseThrow();
    
        List<GroupMember> memberships =
                groupMemberRepository.findByUserId(user.getId());
        return memberships.stream()
    
                .map(m -> getGroup(m.getGroupId(),phoneNumber))
    
                .collect(Collectors.toList());
        }

        @Override
        public void addMember(AddMemberDTO dto, String phone) {
        
            User admin = userRepository.findByPhoneNumber(phone).orElseThrow();
        
            Group group = groupRepository.findById(dto.getGroupId()).orElseThrow();
        
            // 🔥 only admin can add
            if (!group.getCreatedBy().equals(admin.getId())) {
                throw new RuntimeException("Only admin can add members");
            }
        
            if (groupMemberRepository.existsByGroupIdAndUserId(
                    dto.getGroupId(),
                    dto.getUserId()
            )) {
                throw new RuntimeException("User already in group");
            }
        
            GroupMember member = GroupMember.builder()
                    .groupId(dto.getGroupId())
                    .userId(dto.getUserId())
                    .admin(false)
                    .build();
        
            groupMemberRepository.save(member);
        }                  

        @Override
        public GroupResponseDTO getGroup(Long groupId, String phone) {
        
            User user = userRepository.findByPhoneNumber(phone).orElseThrow();
        
            // 🔥 check membership
            if (!groupMemberRepository.existsByGroupIdAndUserId(groupId, user.getId())) {
                throw new RuntimeException("Unauthorized");
            }
        
            Group group = groupRepository.findById(groupId)
                    .orElseThrow(() -> new RuntimeException("Group not found"));
        
            List<Long> members = groupMemberRepository
                    .findByGroupId(groupId)
                    .stream()
                    .map(GroupMember::getUserId)
                    .collect(Collectors.toList());
        
            return GroupResponseDTO.builder()
                    .groupId(group.getId())
                    .name(group.getName())
                    .description(group.getDescription())
                    .groupImage(group.getGroupImage())
                    .createdBy(group.getCreatedBy())
                    .chatId(group.getChatId())
                    .members(members)
                    .build();
        }


    @Override
    public void removeMember(AddMemberDTO dto, String phone) {

        User admin = userRepository.findByPhoneNumber(phone).orElseThrow();
    
        Group group = groupRepository.findById(dto.getGroupId()).orElseThrow();
    
        if(!group.getCreatedBy().equals(admin.getId())){
            throw new RuntimeException("Only admin can remove");
        }
    
        groupMemberRepository.deleteByGroupIdAndUserId(
                dto.getGroupId(),
                dto.getUserId()
        );
    }

    @Override
    public void leaveGroup(Long groupId, String phone) {
    
        User user = userRepository.findByPhoneNumber(phone).orElseThrow();
    
        if (!groupMemberRepository.existsByGroupIdAndUserId(groupId, user.getId())) {
            throw new RuntimeException("Not a member");
        }
    
        groupMemberRepository.deleteByGroupIdAndUserId(groupId, user.getId());
    }
        
    @Override
    public void deleteGroup(Long groupId, String phone) {
    
        User user = userRepository.findByPhoneNumber(phone).orElseThrow();
    
        Group group = groupRepository.findById(groupId)
                .orElseThrow();
    
        if (!group.getCreatedBy().equals(user.getId())) {
            throw new RuntimeException("Only admin can delete group");
        }
    
        groupMemberRepository.deleteAll(
                groupMemberRepository.findByGroupId(groupId)
        );
    
        groupRepository.delete(group);
    }     
}