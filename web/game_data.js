// Auto-generated from /data by tools/validate_game_data.py — DO NOT EDIT MANUALLY
window.ZTB_DATA = {
  "backgrounds": [
    {
      "backgroundId": "bg_orphan",
      "name": "Mái Ấm Tình Thương",
      "subtitle": "Khởi đầu từ con số 0 tròn trĩnh",
      "description": "Bạn lớn lên tại một mái ấm tình thương ở ngoại thành. Không có chỗ dựa tài chính từ gia đình, nhưng ý chí tự lập và nghị lực vượt khó của bạn mạnh mẽ hơn bất kỳ ai.",
      "badge": "🔥 Độ khó: Thử thách",
      "initialCash": 0,
      "pocketMoneyChild": 0,
      "pocketMoneyTeen": 500000,
      "comingOfAgeGrant": 3000000,
      "familyAllowancePerYear": 0,
      "statBonuses": {
        "health": -5,
        "intelligence": 5,
        "happiness": -10,
        "discipline": 20,
        "luck": 0,
        "parentRelationship": 30,
        "socialStatus": 5,
        "charisma": 5,
        "karma": 15
      },
      "startingFlags": [
        "bg_orphan"
      ]
    },
    {
      "backgroundId": "bg_working_class",
      "name": "Gia Đình Lao Động Bình Dân",
      "subtitle": "Cơm nhà dưa cà, ấm áp tình thân",
      "description": "Bố chạy xe công nghệ, mẹ bán tạp hóa nhỏ đầu ngõ. Cuộc sống tuy chắt chiu từng đồng học phí nhưng gia đình luôn yêu thương và dạy bạn biết quý trọng sức lao động.",
      "badge": "⚖️ Độ khó: Cân bằng",
      "initialCash": 0,
      "pocketMoneyChild": 200000,
      "pocketMoneyTeen": 1200000,
      "comingOfAgeGrant": 8000000,
      "familyAllowancePerYear": 4000000,
      "statBonuses": {
        "health": 5,
        "intelligence": 0,
        "happiness": 10,
        "discipline": 10,
        "luck": 0,
        "parentRelationship": 85,
        "socialStatus": 20,
        "practicalSkills": 10,
        "karma": 10
      },
      "startingFlags": [
        "bg_working_class"
      ]
    },
    {
      "backgroundId": "bg_intellectual",
      "name": "Gia Đình Công Chức Trí Thức",
      "subtitle": "Nề nếp gia phong, kỳ vọng học vấn cao",
      "description": "Bố là kỹ sư, mẹ là giáo viên cấp 3 tại thành phố lớn. Bạn được đầu tư học hành bài bản từ sớm nhưng cũng chịu không ít áp lực 'con nhà người ta'.",
      "badge": "📚 Độ khó: Thuận lợi",
      "initialCash": 0,
      "pocketMoneyChild": 600000,
      "pocketMoneyTeen": 3000000,
      "comingOfAgeGrant": 25000000,
      "familyAllowancePerYear": 12000000,
      "statBonuses": {
        "health": 5,
        "intelligence": 18,
        "happiness": 0,
        "discipline": 15,
        "stress": 10,
        "parentRelationship": 75,
        "socialStatus": 45,
        "financialLiteracy": 10
      },
      "startingFlags": [
        "bg_intellectual"
      ]
    },
    {
      "backgroundId": "bg_wealthy_dynasty",
      "name": "Trâm Anh Thế Phiệt",
      "subtitle": "Ngậm thìa vàng từ vạch đích",
      "description": "Bạn sinh ra trong một gia tộc kinh doanh bất động sản có tiếng tại Sài Gòn / Hà Nội. Tiền bạc không thiếu, quan hệ rộng khắp, nhưng giữ được cơ nghiệp hay phá gia chi tử là ở bạn.",
      "badge": "💎 Độ khó: Khởi đầu Đại gia",
      "initialCash": 0,
      "pocketMoneyChild": 2000000,
      "pocketMoneyTeen": 10000000,
      "comingOfAgeGrant": 150000000,
      "familyAllowancePerYear": 36000000,
      "statBonuses": {
        "health": 10,
        "appearance": 10,
        "happiness": 10,
        "discipline": -10,
        "stress": 5,
        "parentRelationship": 65,
        "socialStatus": 80,
        "financialLiteracy": 15,
        "businessAcuity": 15,
        "charisma": 10
      },
      "startingFlags": [
        "bg_wealthy_dynasty"
      ]
    }
  ],
  "careers": [
    {
      "careerId": "job_parttime_barista",
      "title": "Nhân viên Pha chế Cà phê (Part-time)",
      "sector": "Lao động & Dịch vụ",
      "minAge": 16,
      "maxAge": 60,
      "requiredEducation": "THCS",
      "minIntelligence": 20,
      "minDiscipline": 25,
      "minCharisma": 20,
      "monthlySalary": 4500000,
      "annualRaiseRate": 0.05,
      "annualStressDelta": 4,
      "promotionCareerId": "job_store_manager",
      "yearsForPromotion": 3,
      "description": "Pha cà phê sữa đá, trà đào cam sả tại quán cóc đến chuỗi lớn. Rèn sự nhanh nhẹn và giao tiếp."
    },
    {
      "careerId": "job_ride_hailing",
      "title": "Tài xế Công nghệ",
      "sector": "Lao động & Dịch vụ",
      "minAge": 18,
      "maxAge": 62,
      "requiredEducation": "THCS",
      "minIntelligence": 15,
      "minDiscipline": 30,
      "minCharisma": 15,
      "monthlySalary": 11000000,
      "annualRaiseRate": 0.03,
      "annualStressDelta": 8,
      "promotionCareerId": "job_fleet_supervisor",
      "yearsForPromotion": 5,
      "description": "Dầm mưa dãi nắng khắp các con hẻm Hà Nội, Sài Gòn. Thu nhập ổn nếu chăm chỉ chạy giờ cao điểm."
    },
    {
      "careerId": "job_store_manager",
      "title": "Quản lý Cửa hàng F&B",
      "sector": "Lao động & Dịch vụ",
      "minAge": 20,
      "maxAge": 58,
      "requiredEducation": "THPT",
      "minIntelligence": 40,
      "minDiscipline": 50,
      "minCharisma": 45,
      "monthlySalary": 14000000,
      "annualRaiseRate": 0.07,
      "annualStressDelta": 9,
      "promotionCareerId": "job_regional_director_fb",
      "yearsForPromotion": 4,
      "description": "Quản lý nhân sự ca kíp, kiểm kê nguyên liệu và chịu trách nhiệm doanh số cửa hàng."
    },
    {
      "careerId": "job_regional_director_fb",
      "title": "Giám đốc Vùng Chuỗi F&B",
      "sector": "Kinh doanh & Quản trị",
      "minAge": 25,
      "maxAge": 62,
      "requiredEducation": "THPT",
      "minIntelligence": 60,
      "minDiscipline": 65,
      "minCharisma": 65,
      "monthlySalary": 38000000,
      "annualRaiseRate": 0.08,
      "annualStressDelta": 12,
      "promotionCareerId": "job_ceo_corporation",
      "yearsForPromotion": 6,
      "description": "Điều hành 20+ chi nhánh nhà hàng cà phê trên toàn thành phố."
    },
    {
      "careerId": "job_fleet_supervisor",
      "title": "Điều phối viên Đội xe Vận tải",
      "sector": "Lao động & Dịch vụ",
      "minAge": 22,
      "maxAge": 60,
      "requiredEducation": "THPT",
      "minIntelligence": 45,
      "minDiscipline": 55,
      "minCharisma": 35,
      "monthlySalary": 18000000,
      "annualRaiseRate": 0.06,
      "annualStressDelta": 8,
      "promotionCareerId": "",
      "yearsForPromotion": 0,
      "description": "Quản lý lịch trình logistics và đội ngũ tài xế giao nhận."
    },
    {
      "careerId": "job_skilled_technician",
      "title": "Kỹ thuật viên Cơ điện / Ô tô",
      "sector": "Kỹ thuật & Nghề",
      "minAge": 19,
      "maxAge": 60,
      "requiredEducation": "Học nghề",
      "minIntelligence": 45,
      "minDiscipline": 50,
      "minCharisma": 20,
      "monthlySalary": 15000000,
      "annualRaiseRate": 0.07,
      "annualStressDelta": 6,
      "promotionCareerId": "job_chief_engineer_plant",
      "yearsForPromotion": 5,
      "description": "Tay nghề thực chiến cao, luôn được các xưởng dịch vụ và nhà máy săn đón."
    },
    {
      "careerId": "job_chief_engineer_plant",
      "title": "Kỹ sư Trưởng Nhà máy Sản xuất",
      "sector": "Kỹ thuật & Nghề",
      "minAge": 25,
      "maxAge": 62,
      "requiredEducation": "Học nghề",
      "minIntelligence": 65,
      "minDiscipline": 70,
      "minCharisma": 40,
      "monthlySalary": 35000000,
      "annualRaiseRate": 0.08,
      "annualStressDelta": 11,
      "promotionCareerId": "",
      "yearsForPromotion": 0,
      "description": "Giám sát dây chuyền tự động hóa tại khu công nghiệp FDI lớn."
    },
    {
      "careerId": "job_civil_servant",
      "title": "Chuyên viên Hành chính Nhà nước",
      "sector": "Công chức & Giáo dục",
      "minAge": 22,
      "maxAge": 62,
      "requiredEducation": "Đại học",
      "minIntelligence": 55,
      "minDiscipline": 60,
      "minCharisma": 45,
      "monthlySalary": 9500000,
      "annualRaiseRate": 0.06,
      "annualStressDelta": 4,
      "promotionCareerId": "job_department_deputy",
      "yearsForPromotion": 5,
      "description": "Công việc ổn định đúng ý phụ huynh, sáng cắp ô đi tối cắp ô về, chế độ phúc lợi đầy đủ."
    },
    {
      "careerId": "job_department_deputy",
      "title": "Trưởng phòng Kế hoạch Tổng hợp",
      "sector": "Công chức & Giáo dục",
      "minAge": 28,
      "maxAge": 62,
      "requiredEducation": "Đại học",
      "minIntelligence": 70,
      "minDiscipline": 75,
      "minCharisma": 65,
      "monthlySalary": 22000000,
      "annualRaiseRate": 0.07,
      "annualStressDelta": 8,
      "promotionCareerId": "",
      "yearsForPromotion": 0,
      "description": "Vị trí có uy tín xã hội cao, mối quan hệ sâu rộng."
    },
    {
      "careerId": "job_teacher",
      "title": "Giáo viên THPT / Giảng viên",
      "sector": "Công chức & Giáo dục",
      "minAge": 22,
      "maxAge": 62,
      "requiredEducation": "Đại học",
      "minIntelligence": 65,
      "minDiscipline": 60,
      "minCharisma": 55,
      "monthlySalary": 13000000,
      "annualRaiseRate": 0.06,
      "annualStressDelta": 6,
      "promotionCareerId": "job_school_principal",
      "yearsForPromotion": 7,
      "description": "Nghề cao quý trồng người, được học trò và phụ huynh kính trọng."
    },
    {
      "careerId": "job_school_principal",
      "title": "Hiệu trưởng Trường Quốc tế",
      "sector": "Công chức & Giáo dục",
      "minAge": 32,
      "maxAge": 65,
      "requiredEducation": "Đại học",
      "minIntelligence": 80,
      "minDiscipline": 80,
      "minCharisma": 75,
      "monthlySalary": 48000000,
      "annualRaiseRate": 0.08,
      "annualStressDelta": 10,
      "promotionCareerId": "",
      "yearsForPromotion": 0,
      "description": "Lãnh đạo hệ thống giáo dục song ngữ chất lượng cao."
    },
    {
      "careerId": "job_junior_dev",
      "title": "Lập trình viên Junior (Software Dev)",
      "sector": "Công nghệ & AI",
      "minAge": 20,
      "maxAge": 55,
      "requiredEducation": "Học nghề",
      "minIntelligence": 65,
      "minDiscipline": 50,
      "minCharisma": 25,
      "monthlySalary": 18000000,
      "annualRaiseRate": 0.12,
      "annualStressDelta": 10,
      "promotionCareerId": "job_senior_ai_engineer",
      "yearsForPromotion": 3,
      "description": "Code tính năng, fix bug xuyên màn đêm cùng cốc bạc xỉu đá."
    },
    {
      "careerId": "job_senior_ai_engineer",
      "title": "Kỹ sư Cao cấp AI / Cloud Architect",
      "sector": "Công nghệ & AI",
      "minAge": 23,
      "maxAge": 58,
      "requiredEducation": "Học nghề",
      "minIntelligence": 80,
      "minDiscipline": 65,
      "minCharisma": 40,
      "monthlySalary": 52000000,
      "annualRaiseRate": 0.12,
      "annualStressDelta": 13,
      "promotionCareerId": "job_cto_tech",
      "yearsForPromotion": 4,
      "description": "Thiết kế kiến trúc hệ thống triệu người dùng, lương thưởng tính bằng USD."
    },
    {
      "careerId": "job_cto_tech",
      "title": "Giám đốc Công nghệ (CTO Tập đoàn)",
      "sector": "Công nghệ & AI",
      "minAge": 27,
      "maxAge": 65,
      "requiredEducation": "Đại học",
      "minIntelligence": 88,
      "minDiscipline": 75,
      "minCharisma": 65,
      "monthlySalary": 125000000,
      "annualRaiseRate": 0.14,
      "annualStressDelta": 16,
      "promotionCareerId": "job_ceo_corporation",
      "yearsForPromotion": 5,
      "description": "Đứng đầu chiến lược công nghệ của kỳ lân công nghệ Việt Nam."
    },
    {
      "careerId": "job_bank_officer",
      "title": "Chuyên viên Tín dụng Ngân hàng",
      "sector": "Kinh doanh & Quản trị",
      "minAge": 22,
      "maxAge": 58,
      "requiredEducation": "Đại học",
      "minIntelligence": 60,
      "minDiscipline": 55,
      "minCharisma": 60,
      "monthlySalary": 16000000,
      "annualRaiseRate": 0.09,
      "annualStressDelta": 11,
      "promotionCareerId": "job_investment_director",
      "yearsForPromotion": 4,
      "description": "Thẩm định hồ sơ vay, chạy KPI huy động vốn, thưởng Tết hậu hĩnh."
    },
    {
      "careerId": "job_realestate_broker",
      "title": "Chuyên viên Môi giới Bất động sản",
      "sector": "Kinh doanh & Quản trị",
      "minAge": 20,
      "maxAge": 60,
      "requiredEducation": "THPT",
      "minIntelligence": 45,
      "minDiscipline": 45,
      "minCharisma": 65,
      "monthlySalary": 22000000,
      "annualRaiseRate": 0.1,
      "annualStressDelta": 12,
      "promotionCareerId": "job_investment_director",
      "yearsForPromotion": 4,
      "description": "Mặc vest chốt cọc đất nền, căn hộ cao cấp; hoa hồng cao theo nhịp thị trường."
    },
    {
      "careerId": "job_investment_director",
      "title": "Giám đốc Quỹ Đầu tư Tài chính",
      "sector": "Kinh doanh & Quản trị",
      "minAge": 27,
      "maxAge": 65,
      "requiredEducation": "Đại học",
      "minIntelligence": 82,
      "minDiscipline": 75,
      "minCharisma": 75,
      "monthlySalary": 95000000,
      "annualRaiseRate": 0.13,
      "annualStressDelta": 15,
      "promotionCareerId": "job_ceo_corporation",
      "yearsForPromotion": 5,
      "description": "Quản lý danh mục hàng nghìn tỷ đồng trên thị trường chứng khoán và M&A."
    },
    {
      "careerId": "job_ceo_corporation",
      "title": "Tổng Giám đốc Điều hành (CEO Tập đoàn)",
      "sector": "Kinh doanh & Quản trị",
      "minAge": 30,
      "maxAge": 70,
      "requiredEducation": "Đại học",
      "minIntelligence": 85,
      "minDiscipline": 82,
      "minCharisma": 80,
      "monthlySalary": 240000000,
      "annualRaiseRate": 0.15,
      "annualStressDelta": 18,
      "promotionCareerId": "",
      "yearsForPromotion": 0,
      "description": "Đỉnh cao giới làm thuê chuyên nghiệp: lương thưởng và cổ phiếu ESOP khổng lồ."
    },
    {
      "careerId": "job_doctor_resident",
      "title": "Bác sĩ Đa khoa / Nội trú",
      "sector": "Y tế",
      "minAge": 24,
      "maxAge": 65,
      "requiredEducation": "Đại học",
      "minIntelligence": 80,
      "minDiscipline": 75,
      "minCharisma": 50,
      "monthlySalary": 24000000,
      "annualRaiseRate": 0.1,
      "annualStressDelta": 14,
      "promotionCareerId": "job_hospital_director",
      "yearsForPromotion": 6,
      "description": "Trực đêm cấp cứu cứu người, nghề nghiệp danh giá bậc nhất xã hội."
    },
    {
      "careerId": "job_hospital_director",
      "title": "Giám đốc Bệnh viện Quốc tế",
      "sector": "Y tế",
      "minAge": 34,
      "maxAge": 70,
      "requiredEducation": "Đại học",
      "minIntelligence": 90,
      "minDiscipline": 85,
      "minCharisma": 75,
      "monthlySalary": 150000000,
      "annualRaiseRate": 0.11,
      "annualStressDelta": 14,
      "promotionCareerId": "",
      "yearsForPromotion": 0,
      "description": "Chuyên gia đầu ngành y khoa kiêm nhà quản trị bệnh viện hàng đầu."
    },
    {
      "careerId": "job_content_creator",
      "title": "Nhà sáng tạo Nội dung (TikToker / YouTuber)",
      "sector": "Sáng tạo & Giải trí",
      "minAge": 18,
      "maxAge": 50,
      "requiredEducation": "THCS",
      "minIntelligence": 40,
      "minDiscipline": 40,
      "minCharisma": 70,
      "monthlySalary": 25000000,
      "annualRaiseRate": 0.14,
      "annualStressDelta": 10,
      "promotionCareerId": "job_media_mogul",
      "yearsForPromotion": 4,
      "description": "Quay vlog review ẩm thực, livestream chốt đơn và hợp đồng quảng cáo nhãn hàng."
    },
    {
      "careerId": "job_media_mogul",
      "title": "Ngôi sao Giải trí & Chủ tịch Media Agency",
      "sector": "Sáng tạo & Giải trí",
      "minAge": 23,
      "maxAge": 60,
      "requiredEducation": "THPT",
      "minIntelligence": 65,
      "minDiscipline": 65,
      "minCharisma": 88,
      "monthlySalary": 140000000,
      "annualRaiseRate": 0.15,
      "annualStressDelta": 15,
      "promotionCareerId": "",
      "yearsForPromotion": 0,
      "description": "Đại sứ thương hiệu xa xỉ, sở hữu công ty truyền thông quản lý hàng chục KOLs."
    }
  ],
  "assets": [
    {
      "assetId": "re_studio_apt",
      "name": "Căn hộ Studio Ngoại thành (35m²)",
      "category": "real_estate",
      "tier": 1,
      "cost": 1150000000,
      "monthlyPassiveIncome": 5500000,
      "annualAppreciationRate": 0.06,
      "volatility": 0.05,
      "happinessBonus": 8,
      "socialStatusBonus": 10,
      "description": "Tổ ấm đầu tiên thoát cảnh ở trọ, hoặc cho sinh viên thuê lại đều đặn mỗi tháng."
    },
    {
      "assetId": "re_suburb_land",
      "name": "Đất nền Ven đô Đón Quy hoạch (100m²)",
      "category": "real_estate",
      "tier": 2,
      "cost": 1800000000,
      "monthlyPassiveIncome": 0,
      "annualAppreciationRate": 0.13,
      "volatility": 0.16,
      "happinessBonus": 4,
      "socialStatusBonus": 12,
      "description": "Không tạo dòng tiền thuê nhưng tiềm năng tăng giá mạnh khi mở đường vành đai."
    },
    {
      "assetId": "re_luxury_condo",
      "name": "Chung cư Cao cấp Trung tâm (95m²)",
      "category": "real_estate",
      "tier": 2,
      "cost": 4800000000,
      "monthlyPassiveIncome": 22000000,
      "annualAppreciationRate": 0.08,
      "volatility": 0.06,
      "happinessBonus": 15,
      "socialStatusBonus": 22,
      "description": "Căn hộ 3 phòng ngủ view sông lộng gió, tiện ích hồ bơi gym chuẩn 5 sao."
    },
    {
      "assetId": "re_shophouse_street",
      "name": "Nhà phố Mặt tiền Kinh doanh",
      "category": "real_estate",
      "tier": 3,
      "cost": 16500000000,
      "monthlyPassiveIncome": 65000000,
      "annualAppreciationRate": 0.1,
      "volatility": 0.07,
      "happinessBonus": 18,
      "socialStatusBonus": 35,
      "description": "Gà đẻ trứng vàng giữa phố sầm uất, vừa giữ tài sản truyền đời vừa thu tiền thuê lớn."
    },
    {
      "assetId": "re_penthouse_sky",
      "name": "Penthouse Đỉnh Tòa Tháp & Biệt thự Đảo",
      "category": "real_estate",
      "tier": 4,
      "cost": 68000000000,
      "monthlyPassiveIncome": 220000000,
      "annualAppreciationRate": 0.11,
      "volatility": 0.08,
      "happinessBonus": 30,
      "socialStatusBonus": 55,
      "description": "Biểu tượng thượng lưu tối thượng với hồ bơi vô cực riêng tư ngắm toàn cảnh thành phố."
    },
    {
      "assetId": "re_industrial_park",
      "name": "Khu Đô thị & Bất động sản Khu Công nghiệp",
      "category": "real_estate",
      "tier": 5,
      "cost": 450000000000,
      "monthlyPassiveIncome": 2600000000,
      "annualAppreciationRate": 0.12,
      "volatility": 0.1,
      "happinessBonus": 20,
      "socialStatusBonus": 80,
      "description": "Quỹ đất hàng trăm hecta cho các tập đoàn đa quốc gia thuê đặt nhà máy."
    },
    {
      "assetId": "inv_bank_saving",
      "name": "Sổ Tiết kiệm Ngân hàng Kỳ hạn 12T",
      "category": "investment",
      "tier": 1,
      "cost": 20000000,
      "monthlyPassiveIncome": 110000,
      "annualAppreciationRate": 0.065,
      "volatility": 0.005,
      "happinessBonus": 2,
      "socialStatusBonus": 1,
      "description": "Kênh tích lũy an toàn tuyệt đối, lãi kép ổn định giúp bạn yên tâm ngủ ngon."
    },
    {
      "assetId": "inv_sjc_gold",
      "name": "Vàng miếng & Nhẫn tròn trơn 9999 (2 Lượng)",
      "category": "investment",
      "tier": 1,
      "cost": 165000000,
      "monthlyPassiveIncome": 0,
      "annualAppreciationRate": 0.095,
      "volatility": 0.08,
      "happinessBonus": 5,
      "socialStatusBonus": 5,
      "description": "Hầm trú ẩn chống trượt giá truyền thống của người Việt qua mọi thời kỳ biến động."
    },
    {
      "assetId": "inv_vn30_stocks",
      "name": "Danh mục Cổ phiếu Bluechip VN30",
      "category": "investment",
      "tier": 2,
      "cost": 100000000,
      "monthlyPassiveIncome": 450000,
      "annualAppreciationRate": 0.14,
      "volatility": 0.18,
      "happinessBonus": 3,
      "socialStatusBonus": 6,
      "description": "Đầu tư vào các doanh nghiệp đầu ngành ngân hàng, bán lẻ, công nghệ trên sàn HOSE."
    },
    {
      "assetId": "inv_growth_tech_fund",
      "name": "Quỹ Đầu tư Mạo hiểm Công nghệ & AI",
      "category": "investment",
      "tier": 3,
      "cost": 1000000000,
      "monthlyPassiveIncome": 0,
      "annualAppreciationRate": 0.24,
      "volatility": 0.35,
      "happinessBonus": 5,
      "socialStatusBonus": 15,
      "description": "Biến động dữ dội theo chu kỳ công nghệ nhưng có thể nhân nhiều lần tài sản khi trúng sóng."
    },
    {
      "assetId": "biz_coffee_cart",
      "name": "Xe Cà phê Pha máy Mang đi",
      "category": "business",
      "tier": 1,
      "cost": 35000000,
      "monthlyPassiveIncome": 4200000,
      "annualAppreciationRate": 0.04,
      "volatility": 0.12,
      "happinessBonus": 5,
      "socialStatusBonus": 5,
      "description": "Khởi nghiệp nhỏ gọn sáng sớm trước cổng tòa nhà văn phòng, thu hồi vốn nhanh."
    },
    {
      "assetId": "biz_milktea_shop",
      "name": "Cửa hàng Trà sữa & Ăn vặt Đặc sản",
      "category": "business",
      "tier": 2,
      "cost": 350000000,
      "monthlyPassiveIncome": 28000000,
      "annualAppreciationRate": 0.08,
      "volatility": 0.16,
      "happinessBonus": 8,
      "socialStatusBonus": 12,
      "description": "Điểm hẹn đông nghẹt giới trẻ mỗi tối cuối tuần và đơn giao đồ ăn nổ liên tục."
    },
    {
      "assetId": "biz_software_studio",
      "name": "Công ty Phần mềm & Game Studio",
      "category": "business",
      "tier": 3,
      "cost": 3200000000,
      "monthlyPassiveIncome": 195000000,
      "annualAppreciationRate": 0.18,
      "volatility": 0.22,
      "happinessBonus": 14,
      "socialStatusBonus": 28,
      "description": "Xuất khẩu ứng dụng và game di động ra thị trường toàn cầu, biên lợi nhuận ấn tượng."
    },
    {
      "assetId": "biz_retail_chain",
      "name": "Hệ thống Chuỗi Siêu thị & Bán lẻ (50 cửa hàng)",
      "category": "business",
      "tier": 4,
      "cost": 45000000000,
      "monthlyPassiveIncome": 1850000000,
      "annualAppreciationRate": 0.15,
      "volatility": 0.14,
      "happinessBonus": 20,
      "socialStatusBonus": 50,
      "description": "Thương hiệu quốc dân phủ sóng khắp các tỉnh thành với dòng tiền mặt khổng lồ."
    },
    {
      "assetId": "biz_unicorn_conglomerate",
      "name": "Tập đoàn Đa ngành Tỷ Đô (IPO Quốc tế)",
      "category": "business",
      "tier": 5,
      "cost": 1200000000000,
      "monthlyPassiveIncome": 38000000000,
      "annualAppreciationRate": 0.19,
      "volatility": 0.18,
      "happinessBonus": 35,
      "socialStatusBonus": 100,
      "description": "Đế chế kinh tế hàng đầu khu vực (Công nghệ - Năng lượng sạch - Đô thị thông minh), đưa tên bạn vào danh sách Tỷ phú Thế giới!"
    },
    {
      "assetId": "veh_motorbike_sh",
      "name": "Xe Tay ga Cao cấp",
      "category": "vehicle",
      "tier": 1,
      "cost": 98000000,
      "monthlyPassiveIncome": -800000,
      "annualAppreciationRate": -0.08,
      "volatility": 0.02,
      "happinessBonus": 10,
      "socialStatusBonus": 8,
      "description": "Niềm mơ ước thanh xuân, đi hẹn hò hay gặp đối tác đều lịch sự sang trọng."
    },
    {
      "assetId": "veh_luxury_sedan",
      "name": "Xe Hơi Sedan Hạng Sang",
      "category": "vehicle",
      "tier": 2,
      "cost": 2400000000,
      "monthlyPassiveIncome": -8500000,
      "annualAppreciationRate": -0.1,
      "volatility": 0.03,
      "happinessBonus": 18,
      "socialStatusBonus": 25,
      "description": "Che mưa che nắng cho cả gia đình, khẳng định vị thế doanh nhân thành đạt."
    },
    {
      "assetId": "veh_hypercar_yacht",
      "name": "Bộ đôi Siêu xe Thể thao & Du thuyền Vịnh Hạ Long",
      "category": "vehicle",
      "tier": 4,
      "cost": 42000000000,
      "monthlyPassiveIncome": -85000000,
      "annualAppreciationRate": -0.06,
      "volatility": 0.05,
      "happinessBonus": 35,
      "socialStatusBonus": 60,
      "description": "Đỉnh cao hưởng thụ của giới siêu giàu, mở ra những mối quan hệ thượng lưu."
    }
  ],
  "milestoneEvents": [
    {
      "eventId": "evt_00_birth",
      "category": "childhood",
      "title": "Cất tiếng khóc chào đời",
      "minAge": 0,
      "maxAge": 0,
      "priority": 100,
      "isOneTime": true,
      "description": "Bạn vừa sinh ra tại Việt Nam. Giữa mùi thuốc sát trùng dìu dịu của khoa sản, cả gia đình rạng rỡ đón bạn vào lòng.",
      "conditions": [],
      "options": [
        {
          "id": "opt_cry_heroic",
          "label": "Khóc thật to vang dội khắp hành lang khoa sản",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Bác sĩ mỉm cười khen bạn có lá phổi khỏe mạnh phi thường!",
              "statModifiers": {
                "health": 10,
                "happiness": 5
              }
            }
          ]
        },
        {
          "id": "opt_smile_angel",
          "label": "Nắm lấy ngón tay mẹ và mỉm cười thiên thần",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Bố mẹ xúc động rưng rưng vì đứa con ngoan ngoãn đáng yêu.",
              "statModifiers": {
                "parentRelationship": 15,
                "happiness": 10,
                "charisma": 5
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "evt_01_thoi_noi",
      "category": "culture",
      "title": "Lễ Thôi nôi Bốc đồ Đoán tương lai",
      "minAge": 1,
      "maxAge": 1,
      "priority": 98,
      "isOneTime": true,
      "description": "Tròn 1 tuổi! Trước mâm xôi chè cúng Mụ, bố mẹ bày đủ món đồ: cây bút, xấp tiền, ống nghe y tế và chiếc máy tính nhỏ để xem bạn chọn gì.",
      "conditions": [],
      "options": [
        {
          "id": "opt_pick_money",
          "label": "Bò thẳng tới chộp chặt xấp tiền polime mệnh giá lớn",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Cả nhà cười vang thích thú rồi mẹ cất xấp tiền lấy vía lại vào tủ: 'Sau này lớn lên chắc chắn có máu kinh doanh làm tỷ phú đây!'",
              "statModifiers": {
                "financialLiteracy": 10,
                "businessAcuity": 8,
                "luck": 5
              }
            }
          ]
        },
        {
          "id": "opt_pick_pen",
          "label": "Cầm lấy cây bút máy và cuốn sổ nhỏ",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Ông bà gật gù mãn nguyện tin rằng bạn sẽ đỗ đạt thành tài.",
              "statModifiers": {
                "intelligence": 10,
                "discipline": 6
              }
            }
          ]
        },
        {
          "id": "opt_pick_microphone",
          "label": "Cầm chiếc micro đồ chơi gõ nhịp cười khanh khách",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Ai cũng trầm trồ trước sự dạn dĩ và duyên dáng bẩm sinh của bạn.",
              "statModifiers": {
                "charisma": 12,
                "appearance": 5,
                "happiness": 8
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "evt_03_kindergarten",
      "category": "childhood",
      "title": "Ngày đầu tiên đến trường Mầm non",
      "minAge": 3,
      "maxAge": 3,
      "priority": 92,
      "isOneTime": true,
      "description": "Cánh cổng trường mẫu giáo hiện ra. Xung quanh là bản hòa tấu tiếng khóc đòi về nhà của hàng chục đứa trẻ.",
      "conditions": [],
      "options": [
        {
          "id": "opt_cry_along",
          "label": "Ôm chặt chân mẹ khóc nức nở không chịu vào lớp",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Cô giáo phải dỗ dành bạn bằng kẹo sữa và hứa chiều mẹ đón đầu tiên.",
              "statModifiers": {
                "discipline": -4,
                "parentRelationship": 6,
                "happiness": 4
              },
              "educationSet": "Mầm non"
            }
          ]
        },
        {
          "id": "opt_play_blocks",
          "label": "Vẫy tay chào mẹ rồi chạy ngay tới góc xếp hình Lego",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Bạn tự lắp được cả tòa tháp cao và kết thân được hai người bạn mới!",
              "statModifiers": {
                "intelligence": 7,
                "practicalSkills": 6,
                "happiness": 8
              },
              "educationSet": "Mầm non"
            }
          ]
        }
      ]
    },
    {
      "eventId": "evt_05_summer_hometown",
      "category": "culture",
      "title": "Mùa hè Thả diều ở Quê ngoại",
      "minAge": 4,
      "maxAge": 5,
      "priority": 75,
      "isOneTime": true,
      "description": "Nghỉ hè bạn được về quê chơi. Triền đê lồng lộng gió chiều thơm mùi lúa chín, lũ trẻ trong làng rủ bạn đi thả diều sáo.",
      "conditions": [],
      "options": [
        {
          "id": "opt_fly_kite",
          "label": "Chạy chân trần trên đê thả cánh diều bay tít lên mây",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Tuổi thơ rực rỡ nắng vàng giúp cơ thể bạn dẻo dai và tâm hồn tràn đầy niềm vui.",
              "statModifiers": {
                "health": 8,
                "happiness": 12,
                "stress": -5
              }
            }
          ]
        },
        {
          "id": "opt_listen_grandpa",
          "label": "Ngồi bên hiên nhà nghe Ông ngoại kể chuyện lịch sử và cờ tướng",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Bạn học được những nước cờ khai cuộc đầu tiên và bài học làm người sâu sắc.",
              "statModifiers": {
                "intelligence": 8,
                "karma": 8,
                "discipline": 5
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "evt_06_grade1",
      "category": "education",
      "title": "Lễ Khai giảng Lớp 1 Tiểu học",
      "minAge": 6,
      "maxAge": 6,
      "priority": 95,
      "isOneTime": true,
      "description": "Tiếng trống trường rộn rã vang lên. Bạn đeo chiếc cặp chống gù mới tinh bước vào lớp 1A.",
      "conditions": [],
      "options": [
        {
          "id": "opt_front_seat",
          "label": "Xung phong ngồi bàn đầu chăm chú luyện nét chữ nết người",
          "outcomes": [
            {
              "probability": 0.9,
              "message": "Vở sạch chữ đẹp đạt giải Nhất lớp, cô giáo bầu bạn làm Lớp phó học tập!",
              "statModifiers": {
                "intelligence": 9,
                "discipline": 10,
                "socialStatus": 5
              },
              "educationSet": "Tiểu học"
            },
            {
              "probability": 0.1,
              "message": "Ngồi sát bảng quá khiến bạn hơi mỏi mắt vì bụi phấn, nhưng học lực rất vững.",
              "statModifiers": {
                "intelligence": 7,
                "health": -2
              },
              "educationSet": "Tiểu học"
            }
          ]
        },
        {
          "id": "opt_back_seat",
          "label": "Ngồi bàn cuối bày trò bắn bi, đập hình giờ ra chơi",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Bạn trở thành 'thủ lĩnh' giờ ra chơi được cả lớp quý mến dù đôi lần bị ghi sổ đầu bài.",
              "statModifiers": {
                "happiness": 14,
                "charisma": 10,
                "discipline": -5
              },
              "educationSet": "Tiểu học"
            }
          ]
        }
      ]
    },
    {
      "eventId": "evt_08_tet_lixi",
      "category": "culture",
      "title": "Bí ẩn Phong bao Lì xì Ngày Tết",
      "minAge": 7,
      "maxAge": 11,
      "priority": 80,
      "isOneTime": false,
      "description": "Sau 3 ngày Tết đi chúc họ hàng, túi áo bạn căng phồng tiền mừng tuổi mới cứng thơm mùi giấy mới.",
      "conditions": [],
      "options": [
        {
          "id": "opt_mom_bank",
          "label": "Đưa mẹ 'giữ hộ để đóng tiền học'",
          "outcomes": [
            {
              "probability": 0.85,
              "message": "Mẹ cười hiền từ cất gọn vào ví... và khoản tiền ấy mãi mãi đi vào truyền thuyết!",
              "statModifiers": {
                "parentRelationship": 14,
                "karma": 5
              }
            },
            {
              "probability": 0.15,
              "message": "Mẹ mua tặng bạn một chiếc xe đạp mới toanh đúng như lời hứa!",
              "statModifiers": {
                "happiness": 18,
                "health": 5,
                "parentRelationship": 12
              }
            }
          ]
        },
        {
          "id": "opt_piggy_invest",
          "label": "Chia làm hai: một nửa đưa mẹ, một nửa đút lợn đất mua truyện & sách",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Tư duy quản lý tài chính cá nhân hình thành từ rất sớm! Mẹ cũng rất hài lòng.",
              "statModifiers": {
                "cash": 300000,
                "financialLiteracy": 10,
                "intelligence": 5,
                "parentRelationship": 6
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "evt_10_math_contest",
      "category": "education",
      "title": "Đội tuyển Học sinh Giỏi cấp Quận",
      "minAge": 10,
      "maxAge": 11,
      "priority": 85,
      "isOneTime": true,
      "description": "Giáo viên chủ nhiệm nhận thấy tố chất của bạn và đề cử bạn tham gia kỳ thi Olympic Toán - Tin cấp Quận.",
      "conditions": [],
      "options": [
        {
          "id": "opt_cram_math",
          "label": "Quyết tâm ôn luyện các bài toán nâng cao mỗi tối",
          "outcomes": [
            {
              "probability": 0.75,
              "conditionFormula": "intelligence >= 55",
              "message": "Xuất sắc! Bạn giành Giải Nhất cấp Quận kèm tiền thưởng khuyến học!",
              "statModifiers": {
                "intelligence": 12,
                "cash": 500000,
                "parentRelationship": 10,
                "stress": 8
              }
            },
            {
              "probability": 0.25,
              "message": "Đề thi năm nay cực khó, bạn chỉ đạt giải Khuyến khích nhưng học được cách tư duy logic.",
              "statModifiers": {
                "intelligence": 6,
                "stress": 10
              }
            }
          ]
        },
        {
          "id": "opt_join_football",
          "label": "Xin tham gia giải Bóng đá Thiếu niên Nhi đồng của trường",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Những buổi tập trên sân cỏ giúp bạn cao lớn vượt trội và kết giao nhiều anh em tốt.",
              "statModifiers": {
                "health": 12,
                "appearance": 6,
                "charisma": 8,
                "happiness": 10
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "evt_13_net_cafe",
      "category": "childhood",
      "title": "Cám dỗ Quán Net Cỏ Sau Giờ Học",
      "minAge": 12,
      "maxAge": 14,
      "priority": 82,
      "isOneTime": true,
      "description": "Bước vào cấp 2 THCS, nhóm bạn thân rủ bạn cúp tiết học thêm chiều thứ Sáu để ra quán net đầu ngõ cày game.",
      "conditions": [],
      "options": [
        {
          "id": "opt_learn_coding_pc",
          "label": "Ra quán nhưng tò mò tự mày mò cài phần mềm, làm web và sửa máy tính",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Chủ quán bất ngờ vì tài vọc máy của bạn, cho dùng máy miễn phí khi phụ trông quán!",
              "statModifiers": {
                "intelligence": 8,
                "practicalSkills": 14,
                "cash": 200000
              },
              "educationSet": "THCS"
            }
          ]
        },
        {
          "id": "opt_skip_play_game",
          "label": "Cày game hăng say quên trời đất cùng chiến hữu",
          "outcomes": [
            {
              "probability": 0.6,
              "message": "Một buổi chiều giải tỏa căng thẳng cực đã mà bố mẹ không hề hay biết.",
              "statModifiers": {
                "happiness": 12,
                "stress": -8,
                "discipline": -8
              },
              "educationSet": "THCS"
            },
            {
              "probability": 0.4,
              "message": "Mẹ cầm roi mây đứng ngay sau lưng ghế! Bạn bị cấm túc cả tháng trời.",
              "statModifiers": {
                "happiness": -15,
                "parentRelationship": -12,
                "discipline": 8
              },
              "educationSet": "THCS"
            }
          ]
        },
        {
          "id": "opt_go_class_strict",
          "label": "Từ chối dứt khoát và đi học thêm đầy đủ",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Điểm tổng kết học kỳ của bạn đứng Top 3 toàn khối!",
              "statModifiers": {
                "intelligence": 9,
                "discipline": 10,
                "stress": 6
              },
              "educationSet": "THCS"
            }
          ]
        }
      ]
    },
    {
      "eventId": "evt_15_highschool_exam",
      "category": "education",
      "title": "Cuộc Đua Nghẹt Thở Vào Lớp 10 THPT",
      "minAge": 15,
      "maxAge": 15,
      "priority": 96,
      "isOneTime": true,
      "description": "Kỳ thi tuyển sinh lớp 10 khốc liệt hơn cả thi đại học. Hàng vạn thí sinh cạnh tranh từng 0.25 điểm vào trường công lập điểm.",
      "conditions": [],
      "options": [
        {
          "id": "opt_exam_specialized",
          "label": "Đăng ký nguyện vọng 1 vào Trường THPT Chuyên danh giá",
          "outcomes": [
            {
              "probability": 0.65,
              "conditionFormula": "intelligence >= 65",
              "message": "Đỗ Chuyên! Bố mẹ mở tiệc khao cả xóm, môi trường toàn nhân tài mở ra trước mắt bạn.",
              "statModifiers": {
                "intelligence": 15,
                "socialStatus": 15,
                "happiness": 15
              },
              "unlockedFlags": [
                "highschool_specialized"
              ],
              "educationSet": "THPT"
            },
            {
              "probability": 0.35,
              "message": "Thiếu 0.5 điểm môn Chuyên, bạn vào học lớp chọn trường THPT công lập gần nhà.",
              "statModifiers": {
                "intelligence": 6,
                "happiness": -8,
                "stress": 12
              },
              "educationSet": "THPT"
            }
          ]
        },
        {
          "id": "opt_exam_standard",
          "label": "Chọn trường công lập vừa sức để có thời gian rèn kỹ năng mềm",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Bạn đỗ dư điểm chuẩn, tham gia sôi nổi CLB Âm nhạc và Kinh doanh của trường.",
              "statModifiers": {
                "happiness": 12,
                "charisma": 12,
                "stress": -8
              },
              "educationSet": "THPT"
            }
          ]
        }
      ]
    },
    {
      "eventId": "evt_17_first_crush",
      "category": "relationship",
      "title": "Mối Tình Đầu Dưới Tán Phượng Vĩ",
      "minAge": 16,
      "maxAge": 17,
      "priority": 78,
      "isOneTime": true,
      "description": "Người bạn ngồi bàn bên có nụ cười tỏa nắng khiến tim bạn loạn nhịp mỗi giờ ra chơi. Cuối năm lớp 11, bạn định làm gì?",
      "conditions": [],
      "options": [
        {
          "id": "opt_confess_study_group",
          "label": "Viết thư tay kẹp vào vở và rủ cùng ôn thi đôi bạn cùng tiến",
          "outcomes": [
            {
              "probability": 0.7,
              "conditionFormula": "charisma >= 45",
              "message": "Người ấy đỏ mặt gật đầu! Cả hai cùng đèo nhau đi học bằng xe đạp suốt năm cuối cấp.",
              "statModifiers": {
                "happiness": 20,
                "intelligence": 6,
                "charisma": 8
              },
              "unlockedFlags": [
                "had_highschool_sweetheart"
              ]
            },
            {
              "probability": 0.3,
              "message": "Bạn nhận được tấm thẻ 'Bạn tốt' để tập trung chuyện học hành, hơi buồn nhưng trưởng thành hơn.",
              "statModifiers": {
                "happiness": -8,
                "discipline": 8
              }
            }
          ]
        },
        {
          "id": "opt_teen_side_hustle",
          "label": "Tạm gác chuyện tình cảm, nhập phụ kiện điện thoại về bán online kiếm vốn",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Máu kinh doanh trỗi dậy! Bạn kiếm được vài triệu đồng tiêu vặt tự lập từ tuổi 17.",
              "statModifiers": {
                "cash": 4500000,
                "businessAcuity": 12,
                "financialLiteracy": 8
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "evt_18_national_exam",
      "category": "education",
      "title": "Ngã Rẽ Tuổi 18: Kỳ Thi Tốt Nghiệp THPT",
      "minAge": 18,
      "maxAge": 18,
      "priority": 100,
      "isOneTime": true,
      "description": "12 năm đèn sách khép lại trước ngưỡng cửa cuộc đời. Con đường nào sẽ đưa bạn từ hai bàn tay trắng vươn tới đỉnh cao?",
      "conditions": [],
      "options": [
        {
          "id": "opt_university_top",
          "label": "Thi vào Đại học Top đầu (Bách Khoa / Ngoại Thương / Y Dược)",
          "outcomes": [
            {
              "probability": 0.72,
              "conditionFormula": "intelligence >= 65",
              "message": "Giấy báo trúng tuyển về làng! Bạn bước vào giảng đường đại học danh giá đầy tự hào.",
              "statModifiers": {
                "intelligence": 15,
                "socialStatus": 18,
                "stress": 15
              },
              "unlockedFlags": [
                "education_university_tier1"
              ],
              "educationSet": "Đại học"
            },
            {
              "probability": 0.28,
              "message": "Trượt NV1 trong tiếc nuối, bạn theo học nguyện vọng 2 ngành Quản trị kinh doanh.",
              "statModifiers": {
                "intelligence": 8,
                "happiness": -8,
                "stress": 15
              },
              "unlockedFlags": [
                "education_university_tier2"
              ],
              "educationSet": "Đại học"
            }
          ]
        },
        {
          "id": "opt_vocational_tech",
          "label": "Học Cao đẳng Thực hành Công nghệ / Kỹ thuật để ra nghề sớm",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Chương trình 70% thực hành giúp bạn làm chủ tay nghề thực tế nhanh chóng.",
              "statModifiers": {
                "practicalSkills": 22,
                "discipline": 12,
                "happiness": 6
              },
              "unlockedFlags": [
                "education_vocational"
              ],
              "educationSet": "Học nghề"
            }
          ]
        },
        {
          "id": "opt_military_service",
          "label": "Tình nguyện lên đường thực hiện Nghĩa vụ Quân sự",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Môi trường quân ngũ rèn cho bạn thể lực thép, kỷ luật sắt đá và khoản phụ cấp xuất ngũ.",
              "statModifiers": {
                "health": 22,
                "discipline": 28,
                "cash": 25000000,
                "socialStatus": 10
              },
              "unlockedFlags": [
                "veteran_honor"
              ],
              "educationSet": "Học nghề"
            }
          ]
        },
        {
          "id": "opt_startup_now",
          "label": "Dốc vốn mở xe cà phê mang đi & livestream bán hàng",
          "outcomes": [
            {
              "probability": 0.55,
              "conditionFormula": "businessAcuity >= 20",
              "message": "Bắt trúng xu hướng giới trẻ, bạn kiếm được khoản tích lũy đầu đời đáng nể!",
              "statModifiers": {
                "cash": 35000000,
                "businessAcuity": 18,
                "practicalSkills": 12
              },
              "unlockedFlags": [
                "early_founder"
              ]
            },
            {
              "probability": 0.45,
              "message": "Mưa bão liên miên làm vắng khách, bạn lỗ vốn nhưng rút ra bài học xương máu về dòng tiền.",
              "statModifiers": {
                "cash": -10000000,
                "financialLiteracy": 12,
                "stress": 18
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "evt_20_student_dorm",
      "category": "culture",
      "title": "Kiếp Sinh viên Phòng trọ Cuối tháng",
      "minAge": 19,
      "maxAge": 21,
      "priority": 84,
      "isOneTime": true,
      "description": "Ngày 25 hàng tháng, căn phòng trọ 12m² nóng hầm hập, tiền trong ví chỉ còn đúng 120.000đ mà chủ trọ sắp gõ cửa thu tiền điện nước.",
      "conditions": [],
      "options": [
        {
          "id": "opt_tutor_freelance",
          "label": "Nhận dạy gia sư Toán - Anh và làm freelancer buổi tối",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Vừa thoát cảnh mì tôm thanh long, vừa có thu nhập 4 triệu/tháng tự trang trải!",
              "statModifiers": {
                "cash": 12000000,
                "practicalSkills": 12,
                "charisma": 8,
                "stress": 10
              }
            }
          ]
        },
        {
          "id": "opt_hackathon_contest",
          "label": "Ăn mì tôm Hảo Hảo tập trung lập nhóm thi Khởi nghiệp Sinh viên",
          "outcomes": [
            {
              "probability": 0.65,
              "conditionFormula": "intelligence >= 70",
              "message": "Dự án của nhóm bạn giành Giải Nhất toàn quốc trị giá 50 triệu đồng và lọt mắt xanh nhà đầu tư!",
              "statModifiers": {
                "cash": 30000000,
                "businessAcuity": 16,
                "socialStatus": 15,
                "happiness": 20
              }
            },
            {
              "probability": 0.35,
              "message": "Dù dừng chân ở vòng Bán kết, bạn xây dựng được mạng lưới đàn anh giỏi giang trong ngành.",
              "statModifiers": {
                "intelligence": 8,
                "charisma": 10
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "evt_22_first_job",
      "category": "career",
      "title": "Buổi Phỏng vấn Đầu đời Sau Tốt nghiệp",
      "minAge": 22,
      "maxAge": 23,
      "priority": 92,
      "isOneTime": true,
      "description": "Khoác lên mình bộ sơ mi ủi phẳng phiu, bạn bước vào tòa nhà văn phòng hạng A ứng tuyển vị trí nhân sự chính thức.",
      "conditions": [],
      "options": [
        {
          "id": "opt_negotiate_hard",
          "label": "Trình bày portfolio ấn tượng và đàm phán lương khởi điểm cao",
          "outcomes": [
            {
              "probability": 0.65,
              "conditionFormula": "intelligence >= 65",
              "message": "Giám đốc tuyển dụng gật đầu đánh giá cao bản lĩnh của bạn, chốt deal lương thưởng hấp dẫn!",
              "statModifiers": {
                "cash": 25000000,
                "happiness": 18,
                "socialStatus": 12,
                "charisma": 8
              }
            },
            {
              "probability": 0.35,
              "message": "Họ chọn ứng viên nhiều kinh nghiệm hơn, bạn khởi đầu ở công ty vừa với mức lương thử việc.",
              "statModifiers": {
                "cash": 8000000,
                "discipline": 8,
                "stress": 10
              }
            }
          ]
        },
        {
          "id": "opt_join_fast_startup",
          "label": "Đầu quân cho một Startup công nghệ trẻ lương vừa phải kèm cổ phần ESOP",
          "outcomes": [
            {
              "probability": 0.6,
              "message": "Startup gọi vốn Series A thành công! Cổ phần thưởng của bạn tăng giá trị mạnh mẽ.",
              "statModifiers": {
                "cash": 60000000,
                "businessAcuity": 15,
                "practicalSkills": 15,
                "stress": 15
              }
            },
            {
              "probability": 0.4,
              "message": "Làm một lúc 3 vị trí cực kỳ vất vả nhưng năng lực thực chiến của bạn tăng gấp đôi bạn đồng trang lứa.",
              "statModifiers": {
                "cash": 12000000,
                "practicalSkills": 22,
                "stress": 18
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "evt_24_tet_interrogation",
      "category": "culture",
      "title": "Đại Hội Chất Vấn Ngày Tết Quê Nhà",
      "minAge": 23,
      "maxAge": 29,
      "priority": 80,
      "isOneTime": false,
      "description": "Vừa bưng mâm cỗ Tết ra bàn, cô dì chú bác đồng loạt quay sang hỏi: 'Lương tháng mấy chục triệu rồi cháu? Bao giờ cho cả họ ăn cỗ cưới đây?'",
      "conditions": [],
      "options": [
        {
          "id": "opt_humorous_deflect",
          "label": "Cười tươi lì xì mừng tuổi các bậc trưởng bối rồi khéo léo chuyển chủ đề",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "EQ đỉnh cao! Cả bàn tiệc tấm tắc khen bạn khéo ăn nói, bố mẹ nở mày nở mặt.",
              "statModifiers": {
                "cash": -3000000,
                "charisma": 10,
                "parentRelationship": 12,
                "karma": 6
              }
            }
          ]
        },
        {
          "id": "opt_flex_wealth",
          "label": "Nhẹ nhàng chia sẻ dự định mua nhà và đầu tư kinh doanh năm mới",
          "outcomes": [
            {
              "probability": 0.8,
              "conditionFormula": "cash >= 50000000",
              "message": "Ông chú làm doanh nhân trong họ thích thú, giới thiệu ngay cho bạn một mối làm ăn uy tín!",
              "statModifiers": {
                "socialStatus": 15,
                "businessAcuity": 8,
                "happiness": 10
              }
            },
            {
              "probability": 0.2,
              "message": "Hàng xóm mượn tiền đầu năm khiến bạn phải đau đầu tìm cớ từ chối.",
              "statModifiers": {
                "stress": 10
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "evt_26_friend_cafe_pitch",
      "category": "finance",
      "title": "Lời Mời Góp Vốn Mở Quán Cà Phê Acoustic",
      "minAge": 24,
      "maxAge": 31,
      "priority": 85,
      "isOneTime": true,
      "description": "Đứa bạn thân đại học tìm được mặt bằng góc 2 mặt tiền cực đẹp, rủ bạn hùn 100 triệu đồng mở quán cà phê bánh ngọt.",
      "conditions": [
        {
          "field": "cash",
          "operatorType": ">=",
          "numberValue": 100000000
        }
      ],
      "options": [
        {
          "id": "opt_contract_invest",
          "label": "Soạn hợp đồng cổ đông rõ ràng, kiểm toán thu chi minh bạch rồi góp 100 triệu",
          "outcomes": [
            {
              "probability": 0.72,
              "conditionFormula": "financialLiteracy >= 25",
              "message": "Quán lên xu hướng TikTok đông nghịt khách! Bạn được chia cổ tức hậu hĩnh sau 1 năm.",
              "statModifiers": {
                "cash": 180000000,
                "businessAcuity": 15,
                "happiness": 15
              }
            },
            {
              "probability": 0.28,
              "message": "Giá thuê mặt bằng tăng cao, hai bên thanh lý sang nhượng thu hồi lại gần đủ vốn gốc.",
              "statModifiers": {
                "cash": -15000000,
                "financialLiteracy": 10
              }
            }
          ]
        },
        {
          "id": "opt_decline_politely",
          "label": "Từ chối góp vốn để giữ tình bạn, chỉ hỗ trợ tư vấn marketing miễn phí",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Bạn giữ an toàn tuyệt đối cho khoản tiền tích lũy mà tình anh em vẫn bền chặt.",
              "statModifiers": {
                "karma": 6,
                "stress": -5,
                "charisma": 5
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "evt_27_land_fever",
      "category": "finance",
      "title": "Cơn Sốt Đất Nền Vùng Ven & Chứng Khoán",
      "minAge": 26,
      "maxAge": 35,
      "priority": 88,
      "isOneTime": true,
      "description": "Khắp các quán cà phê đâu đâu cũng bàn chuyện đất vùng ven nhân đôi và cổ phiếu vượt đỉnh lịch sử.",
      "conditions": [
        {
          "field": "cash",
          "operatorType": ">=",
          "numberValue": 150000000
        }
      ],
      "options": [
        {
          "id": "opt_due_diligence_land",
          "label": "Tự đi kiểm tra sổ đỏ pháp lý tại phòng địa chính trước khi xuống tiền 150 triệu",
          "outcomes": [
            {
              "probability": 0.75,
              "conditionFormula": "intelligence >= 65",
              "message": "Tầm nhìn chuẩn xác! Khu công nghệ cao khởi công giúp lô đất bạn góp vốn tăng gấp 2.5 lần!",
              "statModifiers": {
                "cash": 250000000,
                "financialLiteracy": 15,
                "happiness": 22,
                "socialStatus": 15
              }
            },
            {
              "probability": 0.25,
              "message": "Thị trường chững lại ngắn hạn, bạn chốt lời nhẹ 15% rồi rút vốn an toàn.",
              "statModifiers": {
                "cash": 22000000,
                "financialLiteracy": 8
              }
            }
          ]
        },
        {
          "id": "opt_fomo_margin",
          "label": "Vay nóng dùng đòn bẩy kịch trần đánh lướt sóng theo 'đội lái'",
          "outcomes": [
            {
              "probability": 0.3,
              "message": "Ăn may thoát hàng ngay đỉnh! Tài khoản nhân lên chóng mặt trong 3 tháng.",
              "statModifiers": {
                "cash": 350000000,
                "stress": 25,
                "happiness": 25
              }
            },
            {
              "probability": 0.7,
              "message": "Cổ phiếu sàn trắng bên mua 5 phiên liên tiếp! Bạn bị call margin bay sạch 150 triệu.",
              "statModifiers": {
                "cash": -150000000,
                "stress": 35,
                "happiness": -25,
                "financialLiteracy": 12
              }
            }
          ]
        },
        {
          "id": "opt_gold_accumulate",
          "label": "Đứng ngoài cơn sốt ảo, mua vàng nhẫn 9999 và gửi tiết kiệm lãi kép",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Khi bong bóng xì hơi, tài sản phòng thủ của bạn vẫn sinh lời bền vững 12%.",
              "statModifiers": {
                "cash": 18000000,
                "stress": -10,
                "discipline": 10
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "evt_29_marriage_milestone",
      "category": "relationship",
      "title": "Trăm Năm Hạnh Phúc: Dựng Vợ Gả Chồng",
      "minAge": 27,
      "maxAge": 34,
      "priority": 90,
      "isOneTime": true,
      "description": "Sau thời gian gắn bó sâu đậm, hai bên gia đình chọn ngày lành tháng tốt bàn chuyện trăm năm cho đôi trẻ.",
      "conditions": [],
      "options": [
        {
          "id": "opt_grand_wedding",
          "label": "Tổ chức hôn lễ 50 bàn sang trọng, mời đối tác và họ hàng hai bên",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Đám cưới rình rang hạnh phúc! Tiền mừng cưới và vàng hồi môn bù lại gần hết chi phí tiệc.",
              "statModifiers": {
                "cash": -45000000,
                "happiness": 25,
                "socialStatus": 18,
                "parentRelationship": 15
              },
              "unlockedFlags": [
                "is_married"
              ],
              "maritalStatusSet": "Đã kết hôn"
            }
          ]
        },
        {
          "id": "opt_intimate_wedding",
          "label": "Tổ chức tiệc báo hỷ ấm cúng tinh tế, dành tiền tích lũy mua nhà",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Người bạn đời thấu hiểu đồng lòng cùng bạn vun đắp nền tảng tài chính gia đình vững chắc.",
              "statModifiers": {
                "cash": 15000000,
                "happiness": 22,
                "financialLiteracy": 10,
                "discipline": 10
              },
              "unlockedFlags": [
                "is_married"
              ],
              "maritalStatusSet": "Đã kết hôn"
            }
          ]
        },
        {
          "id": "opt_focus_empire_single",
          "label": "Xin hoãn chuyện cưới xin để tập trung 100% tâm huyết gây dựng sự nghiệp",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Bạn chọn con đường độc thân tự do để dồn toàn lực cho tham vọng tài chính lớn.",
              "statModifiers": {
                "businessAcuity": 12,
                "discipline": 10,
                "parentRelationship": -8
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "evt_32_first_child",
      "category": "relationship",
      "title": "Tiếng Khóc Thiên Thần Nhỏ Trong Tổ Ấm",
      "minAge": 29,
      "maxAge": 38,
      "priority": 89,
      "isOneTime": true,
      "description": "Gia đình nhỏ đón thành viên mới chào đời! Niềm hạnh phúc vỡ òa đi kèm những đêm thức trắng pha sữa thay tã.",
      "conditions": [
        {
          "field": "hasFlag",
          "operatorType": "==",
          "stringValue": "is_married"
        }
      ],
      "options": [
        {
          "id": "opt_best_care_child",
          "label": "Đăng ký gói thai sản & chăm sóc y tế tốt nhất cho mẹ và bé",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Em bé khỏe mạnh kháu khỉnh, trở thành động lực to lớn để bạn làm giàu truyền đời!",
              "statModifiers": {
                "cash": -35000000,
                "happiness": 28,
                "stress": 10,
                "karma": 10
              },
              "childrenDelta": 1
            }
          ]
        },
        {
          "id": "opt_grandparents_help",
          "label": "Nhờ Ông Bà nội ngoại lên đỡ đần chăm cháu cùng hai vợ chồng",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Ba thế hệ quây quần ấm cúng, tiết kiệm đáng kể chi phí thuê bảo mẫu.",
              "statModifiers": {
                "cash": -12000000,
                "happiness": 20,
                "parentRelationship": 15
              },
              "childrenDelta": 1
            }
          ]
        }
      ]
    },
    {
      "eventId": "evt_35_headhunter_poach",
      "category": "career",
      "title": "Cú Điện Thoại Từ Chuyên Gia Săn Đầu Người",
      "minAge": 31,
      "maxAge": 42,
      "priority": 86,
      "isOneTime": true,
      "description": "Một tập đoàn đa quốc gia liên hệ mời bạn về giữ chức Giám đốc Khối với mức đãi ngộ cao gấp đôi nhưng áp lực KPI khốc liệt.",
      "conditions": [],
      "options": [
        {
          "id": "opt_leap_multinational",
          "label": "Chấp nhận thử thách lớn để bứt phá thu nhập và tầm vóc quản trị",
          "outcomes": [
            {
              "probability": 0.75,
              "conditionFormula": "discipline >= 55",
              "message": "Bạn dẫn dắt đội ngũ vượt 140% chỉ tiêu năm đầu, nhận thưởng nóng hàng trăm triệu đồng!",
              "statModifiers": {
                "cash": 250000000,
                "socialStatus": 20,
                "businessAcuity": 15,
                "stress": 16
              }
            },
            {
              "probability": 0.25,
              "message": "Văn hóa tập đoàn cạnh tranh gay gắt khiến bạn kiệt sức nhẹ, nhưng hồ sơ năng lực cực đẹp.",
              "statModifiers": {
                "cash": 90000000,
                "health": -8,
                "stress": 22
              }
            }
          ]
        },
        {
          "id": "opt_spin_off_company",
          "label": "Từ chối đi làm thuê, tự thành lập doanh nghiệp riêng làm chủ cuộc chơi",
          "outcomes": [
            {
              "probability": 0.65,
              "conditionFormula": "businessAcuity >= 40",
              "message": "Công ty riêng ký được 3 hợp đồng B2B lớn ngay quý đầu hoạt động!",
              "statModifiers": {
                "cash": 420000000,
                "businessAcuity": 25,
                "socialStatus": 25,
                "stress": 18
              },
              "unlockedFlags": [
                "company_founder"
              ]
            },
            {
              "probability": 0.35,
              "message": "Khởi đầu gian nan phải tự bù lỗ chi phí vận hành, nhưng bạn kiên định giữ vững tay chèo.",
              "statModifiers": {
                "cash": -80000000,
                "practicalSkills": 15,
                "stress": 20
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "evt_38_scam_trap",
      "category": "finance",
      "title": "Cạm Bẫy Đầu Tư Siêu Lợi Nhuận 30%/Tháng",
      "minAge": 33,
      "maxAge": 55,
      "priority": 82,
      "isOneTime": true,
      "description": "Một người quen ăn mặc hào nhoáng đi xe sang mời bạn tham gia 'Sàn ngoại hối quốc tế AI' cam kết lãi suất 30% mỗi tháng không rủi ro.",
      "conditions": [
        {
          "field": "cash",
          "operatorType": ">=",
          "numberValue": 100000000
        }
      ],
      "options": [
        {
          "id": "opt_expose_ponzi",
          "label": "Nhận ra ngay mô hình Ponzi lừa đảo, từ chối thẳng và cảnh báo người thân",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "3 tháng sau đường dây sập thật! Nhờ bạn cảnh báo, cả họ thoát nạn mất tiền oan.",
              "statModifiers": {
                "financialLiteracy": 12,
                "karma": 15,
                "socialStatus": 12,
                "happiness": 10
              }
            }
          ]
        },
        {
          "id": "opt_greedy_test",
          "label": "Thử bỏ vào 200 triệu tính 'ăn non rút sớm'",
          "outcomes": [
            {
              "probability": 0.15,
              "message": "Bạn kịp rút gốc ngay tuần trước khi app khóa rút tiền, hú vía một phen!",
              "statModifiers": {
                "cash": 30000000,
                "stress": 20
              }
            },
            {
              "probability": 0.85,
              "message": "App bảo trì vĩnh viễn! Bạn mất trắng 200 triệu đồng cho bài học lòng tham.",
              "statModifiers": {
                "cash": -200000000,
                "happiness": -22,
                "stress": 28,
                "financialLiteracy": 10
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "evt_41_charity_flood",
      "category": "culture",
      "title": "Hướng Về Đồng Bào Vùng Bão Lũ",
      "minAge": 30,
      "maxAge": 75,
      "priority": 76,
      "isOneTime": false,
      "description": "Bão lớn gây ngập lụt nặng tại miền Trung. Các đoàn thiện nguyện đang kêu gọi chung tay hỗ trợ nhu yếu phẩm và dựng lại mái trường.",
      "conditions": [
        {
          "field": "cash",
          "operatorType": ">=",
          "numberValue": 50000000
        }
      ],
      "options": [
        {
          "id": "opt_donate_generous",
          "label": "Ủng hộ 50 triệu đồng và trực tiếp tổ chức chuyến xe cứu trợ tận nơi",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Nụ cười ấm áp của bà con và các em nhỏ khiến tâm hồn bạn thanh thản, phúc đức dòng họ dày thêm.",
              "statModifiers": {
                "cash": -50000000,
                "karma": 25,
                "happiness": 22,
                "socialStatus": 18,
                "stress": -12
              }
            }
          ]
        },
        {
          "id": "opt_donate_modest",
          "label": "Chuyển khoản ủng hộ 5 triệu đồng qua Mặt trận Tổ quốc",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Của ít lòng nhiều, đóng góp thiết thực và minh bạch.",
              "statModifiers": {
                "cash": -5000000,
                "karma": 10,
                "happiness": 8
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "evt_44_midlife_health",
      "category": "childhood",
      "title": "Lời Cảnh Báo Của Cơ Thể Tuổi Trung Niên",
      "minAge": 40,
      "maxAge": 49,
      "priority": 88,
      "isOneTime": true,
      "description": "Những năm tháng cày cuốc quên ngày đêm khiến bạn bắt đầu đau mỏi vai gáy, mỡ máu cao và mất ngủ triền miên.",
      "conditions": [],
      "options": [
        {
          "id": "opt_marathon_lifestyle",
          "label": "Thay đổi lối sống: chạy bộ mỗi sáng 5km, ăn uống khoa học và khám định kỳ",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Sau 6 tháng bạn hoàn thành cự ly Half-Marathon 21km, cơ thể săn chắc tràn đầy sinh lực!",
              "statModifiers": {
                "cash": -15000000,
                "health": 20,
                "appearance": 10,
                "discipline": 12,
                "stress": -18
              }
            }
          ]
        },
        {
          "id": "opt_ignore_workaholic",
          "label": "Uống thuốc giảm đau tạm thời để tiếp tục lao vào chốt thương vụ lớn",
          "outcomes": [
            {
              "probability": 0.6,
              "message": "Thương vụ mang về khoản thưởng lớn nhưng sức khỏe của bạn sụt giảm rõ rệt.",
              "statModifiers": {
                "cash": 300000000,
                "health": -16,
                "stress": 20
              }
            },
            {
              "probability": 0.4,
              "message": "Bạn phải nhập viện cấp cứu 1 tuần vì suy nhược quá độ, tốn kém viện phí.",
              "statModifiers": {
                "cash": -60000000,
                "health": -22,
                "happiness": -15
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "evt_48_shark_deal_ipo",
      "category": "finance",
      "title": "Cơ Hội Thương Vụ M&A & Niêm Yết Cổ Phiếu",
      "minAge": 42,
      "maxAge": 62,
      "priority": 91,
      "isOneTime": true,
      "description": "Một quỹ đầu tư quốc tế từ Singapore ngỏ ý rót vốn chiến lược mở rộng quy mô kinh doanh của bạn ra toàn Đông Nam Á.",
      "conditions": [
        {
          "field": "cash",
          "operatorType": ">=",
          "numberValue": 1000000000
        }
      ],
      "options": [
        {
          "id": "opt_scale_asean",
          "label": "Ký kết liên doanh, tái đầu tư 1 tỷ đồng chuẩn hóa quản trị quốc tế",
          "outcomes": [
            {
              "probability": 0.78,
              "conditionFormula": "businessAcuity >= 45",
              "message": "Cú hích lịch sử! Định giá tài sản thương mại của bạn bùng nổ lên tầm Đại gia nghìn tỷ!",
              "statModifiers": {
                "cash": 3500000000,
                "socialStatus": 30,
                "businessAcuity": 20,
                "happiness": 25
              }
            },
            {
              "probability": 0.22,
              "message": "Khác biệt thị trường nước ngoài khiến kế hoạch mở rộng chậm hơn dự kiến nhưng vẫn có lãi ròng.",
              "statModifiers": {
                "cash": 350000000,
                "stress": 15
              }
            }
          ]
        },
        {
          "id": "opt_keep_family_control",
          "label": "Giữ 100% quyền kiểm soát độc lập cho gia tộc, phát triển chậm mà chắc",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Doanh nghiệp không chịu áp lực từ cổ đông ngoại, tạo dòng tiền cổ tức bền vững mỗi năm.",
              "statModifiers": {
                "cash": 600000000,
                "stress": -8,
                "discipline": 10
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "evt_54_child_education_abroad",
      "category": "relationship",
      "title": "Định Hướng Tương Lai Cho Thế Hệ Kế Thừa",
      "minAge": 48,
      "maxAge": 60,
      "priority": 85,
      "isOneTime": true,
      "description": "Con cái bạn đã khôn lớn trưởng thành và đứng trước ngưỡng cửa đại học / lập nghiệp. Bạn sẽ đầu tư cho con thế nào?",
      "conditions": [
        {
          "field": "childrenCount",
          "operatorType": ">=",
          "numberValue": 1
        }
      ],
      "options": [
        {
          "id": "opt_sponsor_elite_edu",
          "label": "Tài trợ học bổng du học / chương trình Quản trị tinh hoa (300 triệu)",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Con bạn tốt nghiệp loại Xuất sắc trở về, sẵn sàng gánh vác cơ nghiệp gia tộc đời tiếp theo!",
              "statModifiers": {
                "cash": -300000000,
                "happiness": 24,
                "socialStatus": 18,
                "karma": 12
              },
              "unlockedFlags": [
                "heir_elite_trained"
              ]
            }
          ]
        },
        {
          "id": "opt_train_from_ground",
          "label": "Cho con tự đi làm từ vị trí nhân viên cơ sở để thấu hiểu giá trị đồng tiền",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Sự rèn giũa nghiêm khắc giúp con bạn bản lĩnh, không ỷ lại vào gia sản bố mẹ.",
              "statModifiers": {
                "happiness": 15,
                "discipline": 15,
                "karma": 10
              },
              "unlockedFlags": [
                "heir_self_made"
              ]
            }
          ]
        }
      ]
    },
    {
      "eventId": "evt_60_retirement_choice",
      "category": "career",
      "title": "Cột Mốc Tuổi 60: Nghỉ Hưu Hay Tiếp Tục Cống Hiến?",
      "minAge": 60,
      "maxAge": 62,
      "priority": 94,
      "isOneTime": true,
      "description": "Mái tóc đã điểm sương sau hàng thập kỷ bươn chải thương trường. Đã đến lúc bạn chọn nhịp sống cho chặng đường vàng son phía trước.",
      "conditions": [],
      "options": [
        {
          "id": "opt_peaceful_retire",
          "label": "Nghỉ hưu an nhàn: chăm vườn bonsai, thưởng trà mạn và đi du lịch cùng bạn đời",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Tâm an vạn sự an! Sức khỏe tinh thần của bạn hồi phục kỳ diệu bên gia đình.",
              "statModifiers": {
                "health": 12,
                "happiness": 25,
                "stress": -35
              },
              "unlockedFlags": [
                "is_retired"
              ]
            }
          ]
        },
        {
          "id": "opt_senior_advisor",
          "label": "Lùi về hậu trường làm Chủ tịch Hội đồng Cố vấn & Nhà đầu tư Thiên thần",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Trí tuệ từng trải giúp bạn truyền lửa cho thế hệ startup trẻ Việt Nam và thu lợi nhuận đều đặn.",
              "statModifiers": {
                "cash": 500000000,
                "socialStatus": 20,
                "happiness": 18,
                "stress": -10
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "evt_70_longevity_celebration",
      "category": "culture",
      "title": "Đại Lễ Mừng Thọ Tuổi Bảy Mươi",
      "minAge": 70,
      "maxAge": 72,
      "priority": 90,
      "isOneTime": true,
      "description": "Đầu xuân năm mới, con cháu sum vầy đông đủ dâng trà chúc thọ bạn trong sắc áo lụa đỏ truyền thống Việt Nam.",
      "conditions": [],
      "options": [
        {
          "id": "opt_scholarship_fund",
          "label": "Lập Quỹ Khuyến học Dòng họ truyền cảm hứng hiếu học cho con cháu",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Tiếng thơm dòng tộc vang xa, con cháu đời sau luôn tự hào về tấm gương của bạn!",
              "statModifiers": {
                "cash": -100000000,
                "karma": 30,
                "happiness": 25,
                "socialStatus": 25
              },
              "unlockedFlags": [
                "dynasty_scholarship"
              ]
            }
          ]
        },
        {
          "id": "opt_family_vacation",
          "label": "Đài thọ chuyến nghỉ dưỡng Phú Quốc / Đà Nẵng cho đại gia đình sum họp",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Những bức ảnh đại gia đình bên bờ biển trở thành kỷ vật vô giá của cả dòng họ.",
              "statModifiers": {
                "cash": -50000000,
                "happiness": 30,
                "health": 8
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "evt_78_write_memoir_will",
      "category": "finance",
      "title": "Viết Hồi Ký & Phân Định Di Chúc Gia Tộc",
      "minAge": 76,
      "maxAge": 88,
      "priority": 92,
      "isOneTime": true,
      "description": "Nhìn lại hành trình dài từ tay trắng qua bao thăng trầm thời cuộc, bạn ngồi bên bàn gỗ viết lại cuốn hồi ký và văn bản Di chúc pháp lý.",
      "conditions": [],
      "options": [
        {
          "id": "opt_clear_will_trust",
          "label": "Lập Quỹ Tín thác Gia tộc minh bạch để con cháu kế thừa không tranh chấp",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Mọi tài sản được bảo chứng pháp lý chặt chẽ, bảo toàn 100% giá trị cho người thừa kế!",
              "statModifiers": {
                "happiness": 20,
                "stress": -20,
                "karma": 15
              },
              "unlockedFlags": [
                "family_trust_protected"
              ]
            }
          ]
        },
        {
          "id": "opt_publish_bestseller",
          "label": "Xuất bản cuốn hồi ký 'Từ Tay Trắng Đến Đế Chế' tặng doanh nhân trẻ",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Cuốn sách bán chạy hàng vạn bản trên toàn quốc, toàn bộ tiền tác quyền dùng xây cầu vùng sâu!",
              "statModifiers": {
                "karma": 35,
                "socialStatus": 25,
                "happiness": 25
              }
            }
          ]
        }
      ]
    }
  ],
  "randomEvents": [
    {
      "eventId": "rnd_child_sick_weather",
      "category": "childhood",
      "title": "Trái Gió Trở Trời Giao Mùa",
      "minAge": 2,
      "maxAge": 11,
      "priority": 40,
      "isOneTime": false,
      "description": "Thời tiết nắng mưa thất thường khiến bạn bị cảm sốt sổ mũi sụt sịt.",
      "conditions": [],
      "options": [
        {
          "id": "opt_eat_porridge",
          "label": "Ngoan ngoãn ăn bát cháo hành tía tô nóng hổi của mẹ nấu",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Mồ hôi vã ra nhẹ nhõm, bạn khỏe hẳn lại chỉ sau hai ngày!",
              "statModifiers": {
                "health": 4,
                "parentRelationship": 5
              }
            }
          ]
        },
        {
          "id": "opt_hide_medicine",
          "label": "Sợ đắng lén giấu viên thuốc dưới gầm giường rồi chạy đi chơi",
          "outcomes": [
            {
              "probability": 0.5,
              "message": "Sức đề kháng tự nhiên giúp bạn tự khỏi mà chẳng cần uống thuốc!",
              "statModifiers": {
                "happiness": 6
              }
            },
            {
              "probability": 0.5,
              "message": "Cơn ho kéo dài cả tuần làm bạn mệt lả người.",
              "statModifiers": {
                "health": -6,
                "discipline": -3
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "rnd_school_bookfair",
      "category": "education",
      "title": "Hội Sách Cũ Cuối Tuần",
      "minAge": 9,
      "maxAge": 22,
      "priority": 45,
      "isOneTime": false,
      "description": "Đi dạo phố sách cuối tuần, bạn bắt gặp gian hàng sách kinh doanh và kỹ năng giảm giá 50%.",
      "conditions": [],
      "options": [
        {
          "id": "opt_buy_finance_books",
          "label": "Dùng tiền ăn sáng mua bộ sách Tư duy Tài chính & Lập trình",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Những trang sách mở mang chân trời mới về lãi kép và công nghệ!",
              "statModifiers": {
                "intelligence": 5,
                "financialLiteracy": 7,
                "businessAcuity": 4
              }
            }
          ]
        },
        {
          "id": "opt_read_manga_relax",
          "label": "Thuê trọn bộ truyện tranh Doraemon & Conan đọc ngấu nghiến",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Một cuối tuần cười nghiêng ngả xua tan mọi áp lực bài vở!",
              "statModifiers": {
                "happiness": 10,
                "stress": -8
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "rnd_tra_da_insider",
      "category": "culture",
      "title": "Câu Chuyện Bên Quán Trà Đá Vỉa Hè",
      "minAge": 20,
      "maxAge": 65,
      "priority": 48,
      "isOneTime": false,
      "description": "Ngồi nhâm nhi cốc trà đá 5.000đ dưới gốc xà cừ, bạn tình cờ giúp một vị khách lớn tuổi nhặt lại tập tài liệu đánh rơi.",
      "conditions": [],
      "options": [
        {
          "id": "opt_chat_respectfully",
          "label": "Lễ phép gửi lại và trò chuyện cởi mở về chuyện đời chuyện nghề",
          "outcomes": [
            {
              "probability": 0.7,
              "message": "Hóa ra bác ấy là doanh nhân kỳ cựu! Bác chia sẻ cho bạn nhiều kinh nghiệm thương trường quý báu.",
              "statModifiers": {
                "businessAcuity": 8,
                "charisma": 6,
                "karma": 6,
                "luck": 4
              }
            },
            {
              "probability": 0.3,
              "message": "Cuộc trò chuyện chân tình giúp bạn có thêm góc nhìn tích cực về cuộc sống.",
              "statModifiers": {
                "happiness": 7,
                "karma": 4
              }
            }
          ]
        },
        {
          "id": "opt_nod_and_leave",
          "label": "Mỉm cười trao trả rồi vội vã quay lại làm việc",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Việc tốt nhỏ đầu ngày mang lại năng lượng làm việc tập trung.",
              "statModifiers": {
                "discipline": 4,
                "karma": 3
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "rnd_wedding_season_storm",
      "category": "culture",
      "title": "Mùa Cưới Cuối Năm: Bão Thiệp Hồng!",
      "minAge": 22,
      "maxAge": 45,
      "priority": 46,
      "isOneTime": false,
      "description": "Tháng 11 âm lịch tới, bạn nhận liền một lúc 5 tấm thiệp cưới từ đồng nghiệp và bạn học cũ trong cùng một tuần!",
      "conditions": [
        {
          "field": "cash",
          "operatorType": ">=",
          "numberValue": 5000000
        }
      ],
      "options": [
        {
          "id": "opt_attend_all_weddings",
          "label": "Đi dự đầy đủ, ăn mặc bảnh bao giao lưu kết nối bạn bè",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Ví hơi xẹp đi một chút nhưng bạn kết nối lại được nhiều mối quan hệ làm ăn đắt giá!",
              "statModifiers": {
                "cash": -3500000,
                "charisma": 8,
                "socialStatus": 6,
                "happiness": 8
              }
            }
          ]
        },
        {
          "id": "opt_send_envelope_selectively",
          "label": "Chỉ dự đám bạn thân nhất, còn lại gửi mừng khoản vừa phải",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Cân đối chi tiêu hợp lý mà vẫn giữ trọn lễ nghĩa.",
              "statModifiers": {
                "cash": -1800000,
                "financialLiteracy": 5
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "rnd_year_end_raffle",
      "category": "career",
      "title": "Đêm Tiệc Tất Niên Year End Party",
      "minAge": 21,
      "maxAge": 58,
      "priority": 50,
      "isOneTime": false,
      "description": "Không khí tiệc cuối năm sôi động, MC đang đọc con số bốc thăm trúng thưởng Giải Đặc Biệt trên sân khấu!",
      "conditions": [],
      "options": [
        {
          "id": "opt_pray_lucky_draw",
          "label": "Nắm chặt lá phiếu may mắn chờ gọi tên mình",
          "outcomes": [
            {
              "probability": 0.45,
              "conditionFormula": "luck >= 55",
              "message": "TRÚNG RỒI! Bạn ẵm trọn giải thưởng tiền mặt 20 triệu đồng trong tiếng reo hò!",
              "statModifiers": {
                "cash": 20000000,
                "happiness": 18,
                "stress": -10
              }
            },
            {
              "probability": 0.55,
              "message": "Lệch đúng 1 số cuối! Dù sao bạn cũng có bữa tiệc liên hoan no nê vui vẻ.",
              "statModifiers": {
                "happiness": 6,
                "stress": -5
              }
            }
          ]
        },
        {
          "id": "opt_sing_karaoke_stage",
          "label": "Đăng ký lên sân khấu hát máu lửa khuấy động toàn thể công ty",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Màn trình diễn bùng nổ giúp bạn ghi điểm cực mạnh với Ban Giám đốc!",
              "statModifiers": {
                "charisma": 10,
                "socialStatus": 6,
                "happiness": 12,
                "cash": 3000000
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "rnd_karaoke_neighbor",
      "category": "culture",
      "title": "Thử Thách Loa Kẹo Kéo Cuối Tuần",
      "minAge": 20,
      "maxAge": 75,
      "priority": 42,
      "isOneTime": false,
      "description": "10 giờ đêm Chủ nhật, nhà hàng xóm vẫn bật loa kẹo kéo hát nhạc bolero vang rung cả cửa kính nhà bạn.",
      "conditions": [],
      "options": [
        {
          "id": "opt_diplomatic_talk",
          "label": "Mang đĩa trái cây sang cười nói khéo léo nhắc bác hàng xóm vặn nhỏ loa",
          "outcomes": [
            {
              "probability": 0.85,
              "conditionFormula": "charisma >= 40",
              "message": "Bác hàng xóm ngại ngùng tắt loa ngay và hôm sau còn biếu lại túi xoài quê ngon ngọt!",
              "statModifiers": {
                "charisma": 6,
                "stress": -10,
                "happiness": 8
              }
            },
            {
              "probability": 0.15,
              "message": "Hàng xóm đã ngà ngà say nên phải nhờ tổ trưởng dân phố nhắc nhở mới êm xuôi.",
              "statModifiers": {
                "stress": 5
              }
            }
          ]
        },
        {
          "id": "opt_noise_cancelling_work",
          "label": "Đeo tai nghe chống ồn đọc báo cáo thị trường tìm cơ hội đầu tư mới",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Biến nghịch cảnh thành thời gian nghiên cứu hiệu quả!",
              "statModifiers": {
                "financialLiteracy": 6,
                "discipline": 5
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "rnd_distressed_asset_deal",
      "category": "finance",
      "title": "Cơ Hội Mua Lại Tài Sản Ngộp Giá Hời",
      "minAge": 28,
      "maxAge": 70,
      "priority": 55,
      "isOneTime": false,
      "description": "Một chủ doanh nghiệp cần tiền mặt gấp trong 48 giờ nên chào bán lại lô hàng / cổ phần thương mại thấp hơn giá thị trường 35%.",
      "conditions": [
        {
          "field": "cash",
          "operatorType": ">=",
          "numberValue": 200000000
        }
      ],
      "options": [
        {
          "id": "opt_buy_distressed",
          "label": "Thẩm định nhanh trong đêm và giải ngân 200 triệu chốt thương vụ",
          "outcomes": [
            {
              "probability": 0.78,
              "conditionFormula": "financialLiteracy >= 35",
              "message": "Sang tay thành công chỉ sau 2 tháng, bạn thu lãi ròng 95 triệu đồng!",
              "statModifiers": {
                "cash": 95000000,
                "businessAcuity": 8,
                "happiness": 12
              }
            },
            {
              "probability": 0.22,
              "message": "Hàng tồn thanh lý chậm hơn dự kiến, bạn thu hồi vốn hòa tiền sau phí kho bãi.",
              "statModifiers": {
                "financialLiteracy": 5,
                "stress": 6
              }
            }
          ]
        },
        {
          "id": "opt_keep_cash_king",
          "label": "Giữ tiền mặt dự phòng cho kế hoạch lớn hơn",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Kỷ luật quản trị rủi ro luôn là tấm khiên của nhà đầu tư lão luyện.",
              "statModifiers": {
                "discipline": 4,
                "stress": -4
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "rnd_elder_morning_taichi",
      "category": "culture",
      "title": "Buổi Sáng Dưỡng Sinh Bên Hồ",
      "minAge": 58,
      "maxAge": 98,
      "priority": 52,
      "isOneTime": false,
      "description": "5 giờ 30 sáng, làn sương mỏng giăng trên mặt hồ yên ả, hội cao niên khu phố rủ bạn tập dưỡng sinh và đánh cờ tướng.",
      "conditions": [],
      "options": [
        {
          "id": "opt_taichi_tea",
          "label": "Tập bài Thái cực quyền rồi ngồi thưởng trà sen đàm đạo thế sự",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Khí huyết lưu thông, tinh thần sảng khoái giúp tuổi thọ kéo dài thêm!",
              "statModifiers": {
                "health": 7,
                "happiness": 10,
                "stress": -12
              }
            }
          ]
        },
        {
          "id": "opt_mentor_youth",
          "label": "Dành buổi sáng chia sẻ kinh nghiệm khởi nghiệp cho CLB Doanh nhân trẻ",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Các bạn trẻ vô cùng trân trọng những bài học xương máu từ cuộc đời bạn.",
              "statModifiers": {
                "karma": 12,
                "socialStatus": 8,
                "happiness": 12
              }
            }
          ]
        }
      ]
    }
  ]
};
