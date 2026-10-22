# Weight Graph Share Implementation Plan

> **For agentic workers:** Implement task-by-task with verification after every task.

**Goal:** ทำกราฟน้ำหนักจริงให้แสดงเลข เปิด/ปิดเลขได้ และ Export เป็น PNG พร้อมลายน้ำ iFasting

**Architecture:** ใช้ SVG เดิมในหน้า Progress เป็นแหล่งแสดงผล และเพิ่มปุ่มควบคุมสถานะ label ในหน่วยความจำของหน้า เมื่อ Export ให้คัดลอก SVG ไปวาดบน canvas แล้วดาวน์โหลด PNG โดยไม่เปลี่ยน schema หรือส่งข้อมูลออก

**Tech Stack:** ไฟล์ HTML เดียว, SVG, Canvas API, Vanilla JavaScript, Node test runner

## Global Constraints
- สำรองด้วย `cmd /c python backup.py` ก่อนแก้โค้ดทุกครั้ง และตรวจ ZIP ด้วย `zipfile.testzip()`
- เพิ่มบันทึกสั้น ๆ ต่อท้าย `note.md` ทุก work round
- ไม่ commit `note.md`, `backup.py`, ZIP หรือไฟล์ mockup

### Task 1: กราฟและตัวควบคุมตัวเลข

**Files:**
- Modify: `index.html` ส่วน Progress/weight chart
- Test: `tests/*.test.cjs`

- [ ] สำรองและตรวจ ZIP
- [ ] เพิ่ม state สำหรับการแสดงตัวเลข โดยค่าเริ่มต้นเป็นเปิด
- [ ] ผูกปุ่ม toggle กับ SVG label ทุกจุด โดยไม่แก้ records
- [ ] รัน tests, `node --check sw.js`, และ `git diff --check`

### Task 2: Export PNG พร้อมลายน้ำ

**Files:**
- Modify: `index.html` ฟังก์ชัน export กราฟ

- [ ] เพิ่มปุ่ม Export ในกราฟน้ำหนัก
- [ ] สร้าง canvas จาก SVG ที่เห็นจริง รวมตัวเลขตาม toggle และลายน้ำ `iFasting`
- [ ] ดาวน์โหลดชื่อ `iFasting-Weight-Progress-YYYY-MM-DD.png`
- [ ] ทดสอบปุ่มบนหน้าเว็บและตรวจ syntax

### Task 3: ตรวจความเข้ากันได้และส่งขึ้น GitHub

- [ ] ตรวจว่า records เดิมยังอ่านได้และหน้า Progress ไม่ลบข้อมูล
- [ ] เพิ่ม note พร้อมเวลา Asia/Bangkok
- [ ] commit เฉพาะไฟล์ที่จำเป็นและ `git push origin main`
- [ ] ตรวจหน้า GitHub Pages และสรุป commit ให้ผู้ใช้
