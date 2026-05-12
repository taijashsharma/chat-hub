package com.chat.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chat.dto.group.AddMemberDTO;
import com.chat.dto.group.GroupRequestDTO;
import com.chat.dto.group.GroupResponseDTO;
import com.chat.service.GroupService;

import lombok.RequiredArgsConstructor;
@RestController
@RequestMapping("/api/group")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;

    // ================= CREATE =================
    @PostMapping
    public ResponseEntity<GroupResponseDTO> createGroup(
            @RequestBody GroupRequestDTO dto,
            Authentication auth
    ) {
        return ResponseEntity.ok(
                groupService.createGroup(dto, auth.getName())
        );
    }

    // ================= MY GROUPS =================
    @GetMapping("/my")
    public ResponseEntity<List<GroupResponseDTO>> getMyGroups(
            Authentication auth
    ) {
        return ResponseEntity.ok(
                groupService.getUserGroups(auth.getName())
        );
    }

    // ================= SINGLE GROUP =================
    @GetMapping("/{groupId}")
    public ResponseEntity<GroupResponseDTO> getGroup(
            @PathVariable Long groupId,
            Authentication auth
    ) {
        return ResponseEntity.ok(
                groupService.getGroup(groupId, auth.getName()) // 🔥 secure version
        );
    }

    // ================= ADD MEMBER =================
    @PostMapping("/add")
    public ResponseEntity<String> addMember(
            @RequestBody AddMemberDTO dto,
            Authentication auth
    ) {
        groupService.addMember(dto, auth.getName()); // 🔥 admin check inside
        return ResponseEntity.ok("member added");
    }

    // ================= REMOVE MEMBER =================
    @PostMapping("/remove")
    public ResponseEntity<String> removeMember(
            @RequestBody AddMemberDTO dto,
            Authentication auth
    ) {
        groupService.removeMember(dto, auth.getName());
        return ResponseEntity.ok("member removed");
    }

    // ================= LEAVE GROUP =================
    @PostMapping("/leave")
    public ResponseEntity<String> leaveGroup(
            @RequestBody AddMemberDTO dto,
            Authentication auth
    ){
        groupService.leaveGroup(dto.getGroupId(), auth.getName()); // 🔥 FIX
        return ResponseEntity.ok("left group");
    }

    // ================= DELETE GROUP =================
    @DeleteMapping("/{groupId}")
    public ResponseEntity<String> deleteGroup(
            @PathVariable Long groupId,
            Authentication auth
    ){
        groupService.deleteGroup(groupId, auth.getName()); // 🔥 FIX
        return ResponseEntity.ok("group deleted");
    }
}