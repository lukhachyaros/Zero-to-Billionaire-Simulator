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
  "leaderboardRivals": [
    {
      "rivalId": "rank_20_pho_master",
      "name": "Ông Ba Phở Gia Truyền",
      "title": "Quán Phở Bò Phố Cổ",
      "avatar": "🍜",
      "baseNetWorth": 35000000
    },
    {
      "rivalId": "rank_19_coffee_founder",
      "name": "Lê Minh Hoàng",
      "title": "Chuỗi Cà phê Mang đi",
      "avatar": "☕",
      "baseNetWorth": 120000000
    },
    {
      "rivalId": "rank_18_indie_dev",
      "name": "Trần Khánh Vy",
      "title": "Studio Ứng dụng Di động",
      "avatar": "📱",
      "baseNetWorth": 450000000
    },
    {
      "rivalId": "rank_17_home_owner",
      "name": "Nguyễn Quốc Bảo",
      "title": "Chuỗi Căn hộ Dịch vụ",
      "avatar": "🏠",
      "baseNetWorth": 1800000000
    },
    {
      "rivalId": "rank_16_fnb_chain",
      "name": "Phạm Thảo Nhi",
      "title": "Hệ thống Trà sữa & Bánh ngọt",
      "avatar": "🧋",
      "baseNetWorth": 5500000000
    },
    {
      "rivalId": "rank_15_shophouse_king",
      "name": "Hoàng Đức Mạnh",
      "title": "Đầu tư Nhà phố Thương mại",
      "avatar": "🏢",
      "baseNetWorth": 16000000000
    },
    {
      "rivalId": "rank_14_agri_export",
      "name": "Đặng Thu Hà",
      "title": "Xuất khẩu Nông sản Châu Âu",
      "avatar": "🌿",
      "baseNetWorth": 45000000000
    },
    {
      "rivalId": "rank_13_fintech_ceo",
      "name": "Vũ Tuấn Kiệt",
      "title": "Kỳ lân Thanh toán Số",
      "avatar": "💳",
      "baseNetWorth": 120000000000
    },
    {
      "rivalId": "rank_12_logistics_lord",
      "name": "Bùi Thành Long",
      "title": "Tập đoàn Cảng biển & Kho vận",
      "avatar": "🚢",
      "baseNetWorth": 320000000000
    },
    {
      "rivalId": "rank_11_media_queen",
      "name": "Hồ Bảo Châu",
      "title": "Tập đoàn Giải trí & Thương hiệu",
      "avatar": "🎬",
      "baseNetWorth": 780000000000
    },
    {
      "rivalId": "rank_10_bank_chair",
      "name": "Đỗ Minh Khang",
      "title": "Ngân hàng Thương mại Cổ phần",
      "avatar": "🏦",
      "baseNetWorth": 1850000000000
    },
    {
      "rivalId": "rank_09_retail_empress",
      "name": "Nguyễn Phương Linh",
      "title": "Chuỗi Bán lẻ Toàn quốc",
      "avatar": "🛍️",
      "baseNetWorth": 4200000000000
    },
    {
      "rivalId": "rank_08_aviation_mogul",
      "name": "Trần Quang Dũng",
      "title": "Hàng không & Du lịch Nghỉ dưỡng",
      "avatar": "✈️",
      "baseNetWorth": 9500000000000
    },
    {
      "rivalId": "rank_07_steel_industrial",
      "name": "Phạm Đình Hùng",
      "title": "Tập đoàn Công nghiệp Nặng",
      "avatar": "🏭",
      "baseNetWorth": 22000000000000
    },
    {
      "rivalId": "rank_06_semicon_giant",
      "name": "Lý Minh Triết",
      "title": "Tập đoàn Bán dẫn & Cloud AI",
      "avatar": "🤖",
      "baseNetWorth": 42000000000000
    },
    {
      "rivalId": "rank_05_clean_energy",
      "name": "Võ Hải Đăng",
      "title": "Đế chế Năng lượng Tái tạo",
      "avatar": "⚡",
      "baseNetWorth": 68000000000000
    },
    {
      "rivalId": "rank_04_ev_conglomerate",
      "name": "Phạm Nhật Minh",
      "title": "Tập đoàn Đô thị & Xe điện Toàn cầu",
      "avatar": "🏎️",
      "baseNetWorth": 95000000000000
    },
    {
      "rivalId": "rank_03_sea_venture",
      "name": "Elena Tan",
      "title": "Quỹ Đầu tư Công nghệ Đông Nam Á",
      "avatar": "💎",
      "baseNetWorth": 145000000000000
    },
    {
      "rivalId": "rank_02_global_ecomm",
      "name": "Marcus Vance",
      "title": "Siêu Tập đoàn Thương mại Vũ trụ",
      "avatar": "🚀",
      "baseNetWorth": 230000000000000
    },
    {
      "rivalId": "rank_01_world_apex",
      "name": "Alexander Sterling",
      "title": "Huyền thoại AI & Năng lượng Hành tinh",
      "avatar": "👑",
      "baseNetWorth": 350000000000000
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
    },
    {
      "eventId": "p2_01_messy_roommate",
      "category": "culture",
      "title": "Cuộc Chiến Với Bạn Cùng Phòng Bừa Bộn",
      "minAge": 19,
      "maxAge": 24,
      "priority": 65,
      "isOneTime": true,
      "description": "Bạn ở ghép tiết kiệm tiền trọ, nhưng bạn cùng phòng để bát đũa chất cao như núi 4 ngày chưa rửa.",
      "conditions": [],
      "options": [
        {
          "id": "opt_set_house_rules",
          "label": "Họp phòng phân chia lịch trực nhật và quỹ sinh hoạt công bằng rõ ràng",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Căn phòng gọn gàng hẳn lên, cả hai trở thành cặp bạn cùng phòng ăn ý!",
              "statModifiers": {
                "charisma": 8,
                "discipline": 8,
                "stress": -8
              }
            }
          ]
        },
        {
          "id": "opt_headphones_ignore",
          "label": "Chỉ dọn phần góc của mình rồi đeo tai nghe tập trung cày kỹ năng nghề",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Tốc độ học kỹ năng của bạn tăng vọt dù đôi lúc hơi bực mình nhẹ.",
              "statModifiers": {
                "practicalSkills": 10,
                "stress": 6
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p2_02_military_semester",
      "category": "education",
      "title": "Kỳ Học Quân Sự Trên Đồi Gió Lộng",
      "minAge": 19,
      "maxAge": 21,
      "priority": 70,
      "isOneTime": true,
      "description": "Một tháng mặc quân phục xanh gấp chăn vuông góc như bao diêm, sáng 5 rưỡi tập thể dục, tối đàn hát giao lưu cùng đại đội.",
      "conditions": [],
      "options": [
        {
          "id": "opt_shine_boot_camp",
          "label": "Chấp hành kỷ luật nghiêm túc và làm tiểu đội trưởng gương mẫu",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Thể lực dẻo dai hơn hẳn và kết bạn thân với hàng chục sinh viên khoa khác!",
              "statModifiers": {
                "health": 10,
                "discipline": 14,
                "charisma": 8,
                "happiness": 10
              }
            }
          ]
        },
        {
          "id": "opt_night_snack_fun",
          "label": "Tham gia văn nghệ buổi tối và ăn đêm cùng đồng đội",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Kỷ niệm thanh xuân không thể nào quên thời sinh viên!",
              "statModifiers": {
                "happiness": 15,
                "stress": -10,
                "charisma": 6
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p2_03_mlm_seminar_trap",
      "category": "finance",
      "title": "Hội Thảo 'Việc Nhẹ Lương Ngàn Đô'",
      "minAge": 19,
      "maxAge": 25,
      "priority": 74,
      "isOneTime": true,
      "description": "Người quen mời bạn tới hội trường khách sạn nghe diễn giả mặc vest hô hào 'đầu tư 10 triệu để tự do tài chính sau 3 tháng'.",
      "conditions": [],
      "options": [
        {
          "id": "opt_walk_out_smart",
          "label": "Nhận ra dấu hiệu đa cấp biến tướng và lịch sự ra về ngay lập tức",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Bạn giữ nguyên ví tiền an toàn và nâng cao cảnh giác tài chính!",
              "statModifiers": {
                "financialLiteracy": 12,
                "intelligence": 6
              }
            }
          ]
        },
        {
          "id": "opt_warn_friends",
          "label": "Chụp lại tài liệu phân tích lỗ hổng mô hình để cảnh báo bạn bè trong ký túc xá",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Nhiều bạn sinh viên thoát cảnh vay nợ oan nhờ bài phân tích sắc bén của bạn!",
              "statModifiers": {
                "karma": 15,
                "socialStatus": 10,
                "financialLiteracy": 10
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p2_04_former_boss_poach",
      "category": "career",
      "title": "Sếp Cũ Rủ Sang Công Ty Mới Cùng Đánh Lớn",
      "minAge": 24,
      "maxAge": 42,
      "priority": 68,
      "isOneTime": true,
      "description": "Người sếp từng dìu dắt bạn nay đầu quân sang tập đoàn đối thủ làm Giám đốc, ngỏ lời mời bạn theo sang giữ vị trí chủ chốt.",
      "conditions": [],
      "options": [
        {
          "id": "opt_follow_mentor",
          "label": "Tin tưởng đi theo sếp cũ nhận mức thưởng chuyển việc hấp dẫn",
          "outcomes": [
            {
              "probability": 0.8,
              "message": "Hai thầy trò phối hợp ăn ý tạo nên doanh số kỷ lục ngay năm đầu!",
              "statModifiers": {
                "cash": 45000000,
                "socialStatus": 12,
                "businessAcuity": 10
              }
            },
            {
              "probability": 0.2,
              "message": "Môi trường mới áp lực tái cơ cấu nặng nề nhưng thu nhập khá tốt.",
              "statModifiers": {
                "cash": 20000000,
                "stress": 14
              }
            }
          ]
        },
        {
          "id": "opt_stay_loyal",
          "label": "Ở lại công ty hiện tại khẳng định lòng trung thành và vị thế nội bộ",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Ban lãnh đạo ghi nhận sự gắn bó của bạn và trao thêm quyền lợi dự án!",
              "statModifiers": {
                "karma": 10,
                "socialStatus": 10,
                "discipline": 8,
                "cash": 15000000
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p2_05_english_client_pitch",
      "category": "career",
      "title": "Thuyết Trình Dự Án Trước Đối Tác Quốc Tế",
      "minAge": 23,
      "maxAge": 48,
      "priority": 66,
      "isOneTime": true,
      "description": "Đối tác từ Tokyo và Singapore đang ngồi trong phòng họp lớn lắng nghe bản đề xuất trị giá hàng tỷ đồng của đội bạn.",
      "conditions": [],
      "options": [
        {
          "id": "opt_pitch_confidently",
          "label": "Trình bày lưu loát bằng tiếng Anh kèm số liệu ROI thuyết phục",
          "outcomes": [
            {
              "probability": 0.78,
              "conditionFormula": "intelligence >= 65",
              "message": "Hợp đồng được ký kết ngay tại bàn họp! Bạn nhận khoản hoa hồng hậu hĩnh!",
              "statModifiers": {
                "cash": 65000000,
                "charisma": 12,
                "socialStatus": 14,
                "businessAcuity": 10
              }
            },
            {
              "probability": 0.22,
              "message": "Đối tác hẹn xem xét thêm báo giá nhưng khen ngợi tác phong chuyên nghiệp của bạn.",
              "statModifiers": {
                "charisma": 6,
                "practicalSkills": 6
              }
            }
          ]
        },
        {
          "id": "opt_focus_demo_live",
          "label": "Tập trung demo sản phẩm chạy mượt mà thực tế để chứng minh năng lực",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Sản phẩm chạy trơn tru không lỗi khiến khách hàng gật đầu ngay lập tức!",
              "statModifiers": {
                "practicalSkills": 12,
                "cash": 35000000,
                "socialStatus": 8
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p2_06_wrong_group_chat",
      "category": "career",
      "title": "Tai Nạn Gửi Nhầm Tin Nhắn Vào Group Công Ty!",
      "minAge": 22,
      "maxAge": 40,
      "priority": 62,
      "isOneTime": true,
      "description": "Tim bạn ngừng đập 3 giây khi phát hiện tin nhắn than thở 'Deadline vô lý quá' vừa gửi thẳng vào nhóm chat có cả Tổng Giám đốc!",
      "conditions": [],
      "options": [
        {
          "id": "opt_own_up_solution",
          "label": "Không thu hồi muộn màng — nhắn tiếp ngay giải pháp tối ưu tiến độ chuyên nghiệp",
          "outcomes": [
            {
              "probability": 0.8,
              "message": "Cú xoay tình thế cực đỉnh! Sếp bất ngờ ghi nhận sự thẳng thắn và lắng nghe góp ý của bạn!",
              "statModifiers": {
                "charisma": 12,
                "socialStatus": 8,
                "discipline": 6
              }
            },
            {
              "probability": 0.2,
              "message": "Bị nhắc nhở nhẹ trong cuộc họp giao ban nhưng mọi chuyện êm xuôi nhanh chóng.",
              "statModifiers": {
                "stress": 10,
                "discipline": 5
              }
            }
          ]
        },
        {
          "id": "opt_apologize_privately",
          "label": "Thu hồi khẩn cấp và nhắn tin xin lỗi chân thành trực tiếp tới sếp",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Sếp mỉm cười bỏ qua sự cố 'người mới' và dặn dò cẩn thận hơn.",
              "statModifiers": {
                "stress": 8,
                "karma": 4
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p2_07_tech_layoff_wave",
      "category": "career",
      "title": "Làn Sóng Tinh Giản Nhân Sự Mùa Khó Khăn",
      "minAge": 25,
      "maxAge": 50,
      "priority": 68,
      "isOneTime": true,
      "description": "Kinh tế thắt chặt khiến công ty phải cắt giảm 20% chi phí vận hành. Phòng nhân sự triệu tập cuộc họp toàn thể.",
      "conditions": [],
      "options": [
        {
          "id": "opt_prove_core_value",
          "label": "Chứng minh hiệu suất vượt trội và nhận kiêm nhiệm tối ưu hệ thống",
          "outcomes": [
            {
              "probability": 0.8,
              "conditionFormula": "discipline >= 55",
              "message": "Bạn không những giữ vững vị trí mà còn được thăng làm nhân sự nòng cốt kèm thưởng!",
              "statModifiers": {
                "cash": 25000000,
                "discipline": 10,
                "socialStatus": 10,
                "stress": 10
              }
            },
            {
              "probability": 0.2,
              "message": "Khối lượng công việc tăng gấp rưỡi nhưng kỹ năng quản trị khủng hoảng của bạn nâng tầm rõ rệt.",
              "statModifiers": {
                "practicalSkills": 10,
                "stress": 16
              }
            }
          ]
        },
        {
          "id": "opt_upskill_freelance",
          "label": "Chủ động chuẩn bị hồ sơ năng lực và tìm thêm nguồn thu dự án ngoài",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Nhờ chuẩn bị phương án B từ sớm, bạn luôn giữ thế chủ động tài chính!",
              "statModifiers": {
                "cash": 18000000,
                "financialLiteracy": 10,
                "practicalSkills": 8
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p2_08_stolen_credit",
      "category": "career",
      "title": "Ý Tưởng Của Bạn Bị Người Khác Nhận Vơ",
      "minAge": 24,
      "maxAge": 45,
      "priority": 60,
      "isOneTime": true,
      "description": "Trong cuộc họp chiến lược, một đồng nghiệp trình bày nguyên bản kế hoạch tối ưu chi phí mà bạn thức trắng soạn tuần trước mà không nhắc tên bạn.",
      "conditions": [],
      "options": [
        {
          "id": "opt_present_deep_data",
          "label": "Lịch sự xin bổ sung phần số liệu chi tiết và bản thiết kế gốc chỉ mình bạn nắm rõ",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Ban giám đốc nhận ra ngay ai mới là tác giả thực sự của sáng kiến này!",
              "statModifiers": {
                "intelligence": 8,
                "socialStatus": 14,
                "charisma": 10
              }
            }
          ]
        },
        {
          "id": "opt_document_future",
          "label": "Giữ bình tĩnh trong cuộc họp và từ nay luôn gửi email cc tài liệu trước khi trao đổi",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Bài học chốn công sở giúp bạn bảo vệ thành quả chuyên môn chặt chẽ hơn.",
              "statModifiers": {
                "discipline": 10,
                "businessAcuity": 6
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p2_09_singapore_business_trip",
      "category": "career",
      "title": "Chuyến Công Tác Quốc Tế Đầu Tiên Tại Singapore",
      "minAge": 25,
      "maxAge": 45,
      "priority": 64,
      "isOneTime": true,
      "description": "Lần đầu đặt chân đến trung tâm tài chính châu Á dự hội nghị công nghệ và đầu tư quy mô khu vực.",
      "conditions": [],
      "options": [
        {
          "id": "opt_network_summit",
          "label": "Tích cực giao lưu trao đổi danh thiếp với các nhà sáng lập quốc tế",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Bạn kết nối được nhiều cố vấn tầm cỡ và mở mang tư duy toàn cầu!",
              "statModifiers": {
                "businessAcuity": 14,
                "charisma": 10,
                "socialStatus": 12
              }
            }
          ]
        },
        {
          "id": "opt_study_urban_model",
          "label": "Quan sát mô hình vận hành bán lẻ thông minh & bất động sản xanh tại đảo quốc",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Nhiều ý tưởng kinh doanh giá trị cao được bạn ghi chép đầy sổ tay mang về Việt Nam.",
              "statModifiers": {
                "financialLiteracy": 12,
                "intelligence": 8
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p2_10_guest_lecturer",
      "category": "education",
      "title": "Lời Mời Làm Diễn Giả & Giảng Viên Thỉnh Giảng",
      "minAge": 28,
      "maxAge": 55,
      "priority": 60,
      "isOneTime": true,
      "description": "Một trường đại học cũ mời bạn quay lại chia sẻ kinh nghiệm thực chiến cho sinh viên năm cuối vào cuối tuần.",
      "conditions": [],
      "options": [
        {
          "id": "opt_teach_passionately",
          "label": "Nhận lời truyền lửa cho thế hệ trẻ và tuyển thực tập sinh tài năng",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Bài giảng chật kín hội trường! Bạn vừa có thêm thu nhập thù lao vừa nâng tầm uy tín cá nhân.",
              "statModifiers": {
                "cash": 15000000,
                "socialStatus": 14,
                "karma": 12,
                "charisma": 8
              }
            }
          ]
        },
        {
          "id": "opt_donate_back_scholar",
          "label": "Tặng toàn bộ thù lao giảng dạy vào quỹ học bổng khoa",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Sinh viên và thầy cô vô cùng kính trọng tấm lòng của bạn!",
              "statModifiers": {
                "karma": 22,
                "socialStatus": 16,
                "happiness": 15
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p2_11_viral_livestream",
      "category": "finance",
      "title": "Phiên Livestream Bất Ngờ Viral 50.000 Mắt Xem!",
      "minAge": 20,
      "maxAge": 42,
      "priority": 70,
      "isOneTime": true,
      "description": "Video chia sẻ câu chuyện chân thật của bạn bất ngờ lên xu hướng hàng đầu, hàng chục nghìn người ùa vào xem livestream.",
      "conditions": [],
      "options": [
        {
          "id": "opt_launch_flash_sale",
          "label": "Bình tĩnh giữ tương tác tự nhiên và gắn giỏ hàng sản phẩm chất lượng",
          "outcomes": [
            {
              "probability": 0.78,
              "conditionFormula": "charisma >= 45",
              "message": "Đơn hàng nổ ting ting không kịp thở! Phiên live mang về lợi nhuận ròng khủng!",
              "statModifiers": {
                "cash": 85000000,
                "businessAcuity": 12,
                "charisma": 10,
                "happiness": 18
              }
            },
            {
              "probability": 0.22,
              "message": "Lượng đơn tăng đột biến làm hơi quá tải khâu đóng gói nhưng vẫn thu lãi tốt.",
              "statModifiers": {
                "cash": 25000000,
                "stress": 12,
                "practicalSkills": 8
              }
            }
          ]
        },
        {
          "id": "opt_build_personal_brand",
          "label": "Không vội bán hàng, tập trung xây dựng cộng đồng người theo dõi trung thành",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Lượt theo dõi tăng vọt hàng trăm nghìn, các nhãn hàng lớn bắt đầu chủ động mời hợp tác!",
              "statModifiers": {
                "socialStatus": 18,
                "charisma": 12,
                "cash": 30000000
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p2_13_tv_interview_feature",
      "category": "culture",
      "title": "Đài Truyền Hình Mời Phỏng Vấn Gương Mặt Trẻ",
      "minAge": 26,
      "maxAge": 52,
      "priority": 64,
      "isOneTime": true,
      "description": "Chương trình kinh tế buổi tối liên hệ ghi hình phóng sự về hành trình vươn lên và góc nhìn nghề nghiệp của bạn.",
      "conditions": [],
      "options": [
        {
          "id": "opt_share_practical_tips",
          "label": "Chia sẻ chân thành những vấp ngã và bài học quản trị tài chính thực tế",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Phóng sự phát sóng nhận hàng ngàn bình luận tích cực, uy tín thương hiệu cá nhân tăng mạnh!",
              "statModifiers": {
                "socialStatus": 18,
                "charisma": 10,
                "appearance": 5
              }
            }
          ]
        },
        {
          "id": "opt_promote_viet_products",
          "label": "Tranh thủ giới thiệu sản phẩm chất lượng của đội ngũ Việt ra công chúng",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Lượng khách hàng tìm đến tăng vọt ngay sau buổi phát sóng!",
              "statModifiers": {
                "cash": 40000000,
                "businessAcuity": 12,
                "socialStatus": 12
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p2_14_colleague_medical_loan",
      "category": "relationship",
      "title": "Đồng Nghiệp Thân Hỏi Vay Nóng Lo Viện Phí",
      "minAge": 24,
      "maxAge": 55,
      "priority": 58,
      "isOneTime": true,
      "description": "Một người đồng nghiệp từng giúp đỡ bạn nhiều bỗng gọi điện giọng run run cần vay gấp 15 triệu đồng đóng viện phí cho người nhà.",
      "conditions": [
        {
          "field": "cash",
          "operatorType": ">=",
          "numberValue": 20000000
        }
      ],
      "options": [
        {
          "id": "opt_lend_support",
          "label": "Chuyển khoản ngay 15 triệu giúp bạn qua cơn hoạn nạn",
          "outcomes": [
            {
              "probability": 0.75,
              "message": "Người nhà bạn ấy bình phục và họ trả đủ tiền kèm lòng biết ơn sâu sắc, sau này giới thiệu bạn thương vụ lớn!",
              "statModifiers": {
                "cash": 10000000,
                "karma": 20,
                "happiness": 14,
                "socialStatus": 8
              }
            },
            {
              "probability": 0.25,
              "message": "Hoàn cảnh bạn ấy còn chật vật nên mới trả trước được một nửa, coi như làm việc thiện.",
              "statModifiers": {
                "cash": -7500000,
                "karma": 18
              }
            }
          ]
        },
        {
          "id": "opt_gift_and_fundraise",
          "label": "Gửi tặng hẳn 3 triệu không cần trả và đứng ra kêu gọi công đoàn hỗ trợ thêm",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Cả phòng ban chung tay giúp gia đình đồng nghiệp vượt qua giai đoạn khó khăn!",
              "statModifiers": {
                "cash": -3000000,
                "karma": 20,
                "socialStatus": 12,
                "happiness": 12
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p2_17_landlord_double_rent",
      "category": "finance",
      "title": "Chủ Mặt Bằng Đòi Tăng Giá Thuê Gấp Đôi",
      "minAge": 25,
      "maxAge": 55,
      "priority": 66,
      "isOneTime": true,
      "description": "Thấy công việc buôn bán của bạn ngày càng đông khách, chủ nhà bất ngờ đòi tăng tiền thuê mặt bằng gấp đôi vào tháng tới.",
      "conditions": [],
      "options": [
        {
          "id": "opt_negotiate_long_lease",
          "label": "Đàm phán hợp đồng dài hạn 5 năm với mức tăng hợp lý 15%",
          "outcomes": [
            {
              "probability": 0.75,
              "conditionFormula": "charisma >= 50",
              "message": "Lập luận sắc bén về tính ổn định dài hạn thuyết phục được chủ nhà ký phụ lục 5 năm!",
              "statModifiers": {
                "businessAcuity": 12,
                "charisma": 8,
                "stress": -6
              }
            },
            {
              "probability": 0.25,
              "message": "Bạn chấp nhận nhượng bộ nhẹ 25% để giữ vị trí kinh doanh đắc địa.",
              "statModifiers": {
                "stress": 8,
                "businessAcuity": 6
              }
            }
          ]
        },
        {
          "id": "opt_move_online_hub",
          "label": "Chủ động dời sang mặt bằng ngõ rộng giá rẻ hơn và đẩy mạnh bán online",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Chi phí cố định giảm mạnh giúp biên lợi nhuận ròng tăng cao hơn trước!",
              "statModifiers": {
                "cash": 30000000,
                "businessAcuity": 14,
                "financialLiteracy": 10
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p2_18_audit_fraud_catch",
      "category": "finance",
      "title": "Phát Hiện Dấu Hiệu Gian Lận Sổ Sách Nội Bộ",
      "minAge": 28,
      "maxAge": 58,
      "priority": 72,
      "isOneTime": true,
      "description": "Khi kiểm tra báo cáo tài chính quý, bạn nhận ra con số chi phí nguyên vật liệu tăng bất thường không khớp hóa đơn thực tế.",
      "conditions": [],
      "options": [
        {
          "id": "opt_full_audit",
          "label": "Thuê kiểm toán độc lập rà soát toàn bộ sổ sách và thu hồi thất thoát",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Ngăn chặn kịp thời lỗ hổng tài chính lớn và thiết lập hệ thống kiểm soát minh bạch!",
              "statModifiers": {
                "cash": 45000000,
                "financialLiteracy": 14,
                "businessAcuity": 12,
                "discipline": 10
              }
            }
          ]
        },
        {
          "id": "opt_software_erp",
          "label": "Triển khai phần mềm ERP theo dõi thu chi thời gian thực",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Mọi hóa đơn xuất nhập kho được số hóa minh bạch 100%!",
              "statModifiers": {
                "practicalSkills": 12,
                "businessAcuity": 10,
                "financialLiteracy": 10
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p2_19_server_crash_launch",
      "category": "career",
      "title": "Sập Hệ Thống Ngay Giờ Vàng Ra Mắt Sản Phẩm",
      "minAge": 23,
      "maxAge": 50,
      "priority": 64,
      "isOneTime": true,
      "description": "Lượng người dùng truy cập tăng gấp 20 lần dự kiến khiến máy chủ quá tải đúng lúc chiến dịch quảng cáo vừa chạy!",
      "conditions": [],
      "options": [
        {
          "id": "opt_scale_cloud_fast",
          "label": "Nâng cấp cụm server Cloud dự phòng ngay lập tức và gửi mã tri ân khách",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Hệ thống hồi phục sau 12 phút và cơn sốt mua hàng bùng nổ kỷ lục!",
              "statModifiers": {
                "cash": 50000000,
                "practicalSkills": 10,
                "businessAcuity": 10,
                "stress": 12
              }
            }
          ]
        },
        {
          "id": "opt_turn_into_meme",
          "label": "Đăng bài xin lỗi hài hước 'Vì được yêu thương quá mức nên server ngất xỉu'",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Cộng đồng mạng thích thú chia sẻ rầm rộ biến sự cố thành chiến dịch PR miễn phí!",
              "statModifiers": {
                "charisma": 14,
                "socialStatus": 12,
                "happiness": 10
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p2_20_competitor_rumor",
      "category": "career",
      "title": "Đối Thủ Tung Tin Đồn Thất Thiệt",
      "minAge": 26,
      "maxAge": 58,
      "priority": 66,
      "isOneTime": true,
      "description": "Trên mạng xã hội bỗng xuất hiện hàng loạt tài khoản ảo tung tin bịa đặt nhằm hạ bệ uy tín công việc và sản phẩm của bạn.",
      "conditions": [],
      "options": [
        {
          "id": "opt_transparent_evidence",
          "label": "Công bố đầy đủ giấy kiểm định chất lượng và mời khách hàng kiểm chứng trực tiếp",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Sự thật minh bạch dập tắt hoàn toàn tin đồn, khách hàng tin yêu gấp bội!",
              "statModifiers": {
                "socialStatus": 16,
                "karma": 10,
                "businessAcuity": 8
              }
            }
          ]
        },
        {
          "id": "opt_legal_notice",
          "label": "Lập vi bằng chứng cứ gửi văn bản pháp lý yêu cầu gỡ bỏ tin sai sự thật",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Các trang tin phải đăng bài đính chính công khai, uy tín được bảo toàn trọn vẹn.",
              "statModifiers": {
                "discipline": 10,
                "socialStatus": 12,
                "stress": 6
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p2_21_franchise_coffee_deal",
      "category": "finance",
      "title": "Cơ Hội Mua Nhượng Quyền Thương Hiệu Lớn",
      "minAge": 25,
      "maxAge": 52,
      "priority": 68,
      "isOneTime": true,
      "description": "Chuỗi đồ uống nổi tiếng mở suất nhượng quyền độc quyền tại khu đô thị mới sắp bàn giao 5.000 căn hộ.",
      "conditions": [
        {
          "field": "cash",
          "operatorType": ">=",
          "numberValue": 300000000
        }
      ],
      "options": [
        {
          "id": "opt_buy_franchise",
          "label": "Rót 300 triệu mở cửa hàng nhượng quyền đón cư dân mới",
          "outcomes": [
            {
              "probability": 0.78,
              "conditionFormula": "businessAcuity >= 35",
              "message": "Cư dân dọn về đông nghịt! Cửa hàng hoàn vốn siêu tốc và sinh lời ròng cực mạnh!",
              "statModifiers": {
                "cash": 450000000,
                "businessAcuity": 15,
                "happiness": 18
              }
            },
            {
              "probability": 0.22,
              "message": "Tiến độ bàn giao chung cư chậm nửa năm nhưng sau đó bắt đầu có lãi ổn định.",
              "statModifiers": {
                "cash": 40000000,
                "stress": 10
              }
            }
          ]
        },
        {
          "id": "opt_build_own_brand",
          "label": "Không phụ thuộc nhượng quyền — tự xây thương hiệu riêng tiết kiệm phí bản quyền",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Bạn làm chủ hoàn toàn công thức và biên lợi nhuận 100%!",
              "statModifiers": {
                "businessAcuity": 14,
                "practicalSkills": 10,
                "cash": 120000000
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p2_22_hire_star_talent",
      "category": "career",
      "title": "Chiêu Mộ Nhân Tài Hạng S Đầu Ngành",
      "minAge": 28,
      "maxAge": 58,
      "priority": 66,
      "isOneTime": true,
      "description": "Một chuyên gia kiệt xuất từng làm ở tập đoàn Fortune 500 vừa về nước đang cân nhắc gia nhập đội ngũ của bạn.",
      "conditions": [],
      "options": [
        {
          "id": "opt_offer_esop_vision",
          "label": "Chia sẻ tầm nhìn lớn và trao gói cổ phần thưởng theo hiệu quả",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Nhân tài gật đầu đồng hành! Năng suất cả đội ngũ tăng gấp ba chỉ sau hai quý!",
              "statModifiers": {
                "cash": 120000000,
                "businessAcuity": 14,
                "socialStatus": 12
              }
            }
          ]
        },
        {
          "id": "opt_collaborate_project",
          "label": "Mời hợp tác cố vấn chiến lược theo từng dự án trọng điểm",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Chi phí gọn nhẹ mà vẫn giải quyết triệt để các bài toán hóc búa nhất!",
              "statModifiers": {
                "cash": 55000000,
                "intelligence": 8,
                "financialLiteracy": 8
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p2_24_young_entrepreneur_award",
      "category": "career",
      "title": "Đề Cử Giải Thưởng Doanh Nhân Tiêu Biểu",
      "minAge": 28,
      "maxAge": 45,
      "priority": 74,
      "isOneTime": true,
      "description": "Những đóng góp kinh tế và việc làm bạn tạo ra giúp tên tuổi bạn lọt danh sách Top 10 Gương mặt Doanh nhân Trẻ xuất sắc.",
      "conditions": [
        {
          "field": "socialStatus",
          "operatorType": ">=",
          "numberValue": 45
        }
      ],
      "options": [
        {
          "id": "opt_attend_gala",
          "label": "Lên sân khấu nhận cúp vinh danh và phát biểu truyền cảm hứng",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Cúp vàng Doanh nhân Tiêu biểu giúp bạn mở ra cánh cửa hợp tác với các tập đoàn đầu ngành!",
              "statModifiers": {
                "socialStatus": 20,
                "happiness": 20,
                "charisma": 10,
                "cash": 80000000
              }
            }
          ]
        },
        {
          "id": "opt_credit_team",
          "label": "Mời cộng sự đồng hành cùng lên nhận giải tri ân tập thể",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Đội ngũ gắn kết như một gia đình và cống hiến hết mình vì tương lai chung!",
              "statModifiers": {
                "karma": 18,
                "socialStatus": 16,
                "businessAcuity": 10
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p2_25_supply_chain_disruption",
      "category": "finance",
      "title": "Đứt Gãy Chuỗi Cung Ứng Nguyên Liệu Nhập Khẩu",
      "minAge": 27,
      "maxAge": 60,
      "priority": 62,
      "isOneTime": true,
      "description": "Tuyến vận tải biển quốc tế tắc nghẽn khiến nguồn cung linh kiện và nguyên liệu đầu vào chậm trễ 2 tháng.",
      "conditions": [],
      "options": [
        {
          "id": "opt_localize_suppliers",
          "label": "Tìm kiếm và chuẩn hóa các nhà cung cấp nội địa Việt Nam chất lượng cao",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Không chỉ vượt bão thành công mà chi phí vận chuyển giảm hẳn 25%!",
              "statModifiers": {
                "businessAcuity": 14,
                "practicalSkills": 10,
                "cash": 60000000
              }
            }
          ]
        },
        {
          "id": "opt_air_freight_vip",
          "label": "Chấp nhận thuê vận tải hàng không cho đơn hàng gấp để giữ chữ tín giao đúng hẹn",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Khách hàng lớn cảm phục uy tín của bạn và ký thêm hợp đồng dài hạn 3 năm!",
              "statModifiers": {
                "socialStatus": 14,
                "karma": 8,
                "cash": 45000000
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p2_26_ai_automation_shift",
      "category": "career",
      "title": "Cách Mạng Tự Động Hóa Quy Trình Bằng AI",
      "minAge": 25,
      "maxAge": 58,
      "priority": 72,
      "isOneTime": true,
      "description": "Công nghệ Trí tuệ Nhân tạo bùng nổ giúp rút ngắn 70% thời gian xử lý báo cáo, thiết kế và chăm sóc khách hàng.",
      "conditions": [],
      "options": [
        {
          "id": "opt_adopt_ai_early",
          "label": "Tiên phong học và triển khai trợ lý AI cho toàn bộ quy trình công việc",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Hiệu suất công việc của bạn tăng gấp 4 lần đồng nghiệp, mở đường thu nhập vượt trội!",
              "statModifiers": {
                "intelligence": 12,
                "practicalSkills": 14,
                "businessAcuity": 10,
                "cash": 75000000
              }
            }
          ]
        },
        {
          "id": "opt_train_colleagues",
          "label": "Tổ chức buổi chia sẻ hướng dẫn mọi người dùng AI nâng cao tay nghề",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Bạn trở thành chuyên gia đổi mới sáng tạo được toàn thể tổ chức săn đón!",
              "statModifiers": {
                "socialStatus": 16,
                "charisma": 10,
                "intelligence": 8
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p4_01_meet_inlaws_chicken",
      "category": "relationship",
      "title": "Về Ra Mắt Nhà Người Yêu — Thử Thách Chặt Gà!",
      "minAge": 22,
      "maxAge": 34,
      "priority": 72,
      "isOneTime": true,
      "description": "Lần đầu về quê người yêu ăn giỗ ra mắt họ hàng, bác trai cười hiền đưa cho con dao chặt con gà luộc vàng óng trên thớt!",
      "conditions": [],
      "options": [
        {
          "id": "opt_chop_pro_style",
          "label": "Bình tĩnh chặt từng miếng vuông vức đều tăm tắp xếp đĩa đẹp như nhà hàng",
          "outcomes": [
            {
              "probability": 0.8,
              "conditionFormula": "practicalSkills >= 35",
              "message": "Cả họ nhà người yêu trầm trồ khen nức nở 'chỉ có 10 điểm không có nhưng'!",
              "statModifiers": {
                "happiness": 18,
                "charisma": 10,
                "socialStatus": 10
              }
            },
            {
              "probability": 0.2,
              "message": "Hơi nát nhẹ miếng cổ nhưng nhờ nhanh nhẹn dọn dẹp rửa bát nên vẫn ghi điểm tuyệt đối!",
              "statModifiers": {
                "happiness": 10,
                "practicalSkills": 6
              }
            }
          ]
        },
        {
          "id": "opt_humble_ask_help",
          "label": "Cười duyên xin bác trai chỉ bảo bí quyết chặt gà truyền thống gia đình",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Bác trai khoái chí chỉ từng đường dao và rót chén trà mời bạn ngồi trò chuyện thân mật!",
              "statModifiers": {
                "charisma": 12,
                "happiness": 14,
                "karma": 5
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p4_03_cloud_hunting_trip",
      "category": "culture",
      "title": "Chuyến Phượt Săn Mây Tây Bắc Tuổi Trẻ",
      "minAge": 20,
      "maxAge": 34,
      "priority": 60,
      "isOneTime": true,
      "description": "Cuối tuần nhóm bạn thân rủ nhau chạy cung đèo hùng vĩ săn biển mây bình minh giữa núi rừng Tây Bắc.",
      "conditions": [],
      "options": [
        {
          "id": "opt_sunrise_peaks",
          "label": "Dậy từ 4 giờ sáng leo đỉnh đón biển mây bồng bềnh trước ánh nắng đầu ngày",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Khung cảnh kỳ vĩ xua tan mọi áp lực công việc suốt cả năm qua!",
              "statModifiers": {
                "happiness": 20,
                "stress": -20,
                "health": 8
              }
            }
          ]
        },
        {
          "id": "opt_local_homestay",
          "label": "Giao lưu đốt lửa trại cùng bà con bản địa và tìm hiểu đặc sản vùng cao",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Những bức ảnh và tình bạn sâu đậm trở thành động lực lớn cho bạn!",
              "statModifiers": {
                "charisma": 10,
                "karma": 6,
                "happiness": 14
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p4_04_spouse_salary_card",
      "category": "relationship",
      "title": "Thương Lượng Chuyện 'Nóc Nhà Giữ Quỹ'",
      "minAge": 25,
      "maxAge": 45,
      "priority": 70,
      "isOneTime": true,
      "description": "Sau khi kết hôn, hai vợ chồng ngồi lại thống nhất cách quản lý thu chi và tài khoản chung của gia đình.",
      "conditions": [
        {
          "field": "hasFlag",
          "operatorType": "==",
          "stringValue": "is_married"
        }
      ],
      "options": [
        {
          "id": "opt_three_jars_budget",
          "label": "Lập 3 quỹ minh bạch: Chi tiêu chung, Đầu tư sinh lời và Quỹ cá nhân riêng",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Cả hai đều thoải mái tự do mà tài sản chung vẫn tích lũy cực nhanh!",
              "statModifiers": {
                "financialLiteracy": 12,
                "happiness": 16,
                "stress": -10
              }
            }
          ]
        },
        {
          "id": "opt_give_all_spouse",
          "label": "Tin tưởng giao 'nóc nhà' làm Giám đốc Tài chính gia đình giữ thẻ lương",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Bạn đời chăm lo chu toàn từng bữa cơm giấc ngủ, tiết kiệm giỏi đến bất ngờ!",
              "statModifiers": {
                "happiness": 18,
                "discipline": 8,
                "karma": 6
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p4_05_living_with_inlaws",
      "category": "relationship",
      "title": "Ở Chung Với Bố Mẹ Hay Thuê Riêng Tổ Ấm?",
      "minAge": 26,
      "maxAge": 40,
      "priority": 68,
      "isOneTime": true,
      "description": "Hai vợ chồng bàn tính xem nên ở chung nhà phụng dưỡng bố mẹ hay ra ở riêng để có không gian tự do.",
      "conditions": [
        {
          "field": "hasFlag",
          "operatorType": "==",
          "stringValue": "is_married"
        }
      ],
      "options": [
        {
          "id": "opt_near_but_separate",
          "label": "Ra ở riêng ngay gần nhà bố mẹ để vừa tự do vừa tiện sang thăm hỏi mỗi ngày",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Khoảng cách vàng giúp tình cảm hai bên gia đình lúc nào cũng hòa thuận đầm ấm!",
              "statModifiers": {
                "happiness": 18,
                "parentRelationship": 12,
                "stress": -8
              }
            }
          ]
        },
        {
          "id": "opt_stay_multigen",
          "label": "Ở chung đại gia đình ba thế hệ, tiết kiệm được trọn vẹn chi phí thuê nhà",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Bữa cơm gia đình rộn rã tiếng cười và bạn tích lũy vốn nhanh hơn hẳn!",
              "statModifiers": {
                "cash": 35000000,
                "parentRelationship": 15,
                "karma": 10
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p4_06_child_school_race",
      "category": "relationship",
      "title": "Cuộc Đua Chọn Trường Điểm Cho Con",
      "minAge": 32,
      "maxAge": 48,
      "priority": 72,
      "isOneTime": true,
      "description": "Con bạn sắp vào tiểu học. Phụ huynh khắp nơi bàn tán sôi nổi chuyện chọn trường công chuẩn quốc gia hay trường song ngữ.",
      "conditions": [
        {
          "field": "childrenCount",
          "operatorType": ">=",
          "numberValue": 1
        }
      ],
      "options": [
        {
          "id": "opt_balanced_public",
          "label": "Chọn trường chất lượng gần nhà để con không phải thức khuya dậy sớm chạy xe xa",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Con vui vẻ khỏe mạnh, mỗi chiều còn được bố mẹ dẫn đi chơi thể thao!",
              "statModifiers": {
                "happiness": 16,
                "stress": -10,
                "karma": 6
              }
            }
          ]
        },
        {
          "id": "opt_bilingual_prep",
          "label": "Đầu tư lớp ngoại ngữ và kỹ năng mềm buổi tối đồng hành cùng con",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Con tiếp thu cực nhanh và tự tin giao tiếp song ngữ từ nhỏ!",
              "statModifiers": {
                "happiness": 14,
                "socialStatus": 8,
                "intelligence": 4
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p4_07_10th_anniversary",
      "category": "relationship",
      "title": "Kỷ Niệm 10 Năm Ngày Cưới",
      "minAge": 36,
      "maxAge": 52,
      "priority": 68,
      "isOneTime": true,
      "description": "Một thập kỷ bên nhau qua bao nắng mưa cuộc đời! Bạn muốn tạo bất ngờ gì cho người bạn đời?",
      "conditions": [
        {
          "field": "hasFlag",
          "operatorType": "==",
          "stringValue": "is_married"
        }
      ],
      "options": [
        {
          "id": "opt_romantic_dinner_letter",
          "label": "Tự tay nấu bữa tối dưới ánh nến kèm bức thư viết tay và bó hoa tươi",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Người bạn đời rưng rưng hạnh phúc như ngày đầu mới yêu!",
              "statModifiers": {
                "happiness": 24,
                "stress": -15,
                "karma": 8
              }
            }
          ]
        },
        {
          "id": "opt_family_photoshoot",
          "label": "Đưa cả gia đình đi chụp bộ ảnh kỷ niệm 10 năm bên nhau",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Khung ảnh đại gia đình rạng rỡ treo trang trọng ngay phòng khách!",
              "statModifiers": {
                "happiness": 20,
                "socialStatus": 6
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p4_08_caring_aging_parents",
      "category": "relationship",
      "title": "Túc Trực Chăm Sóc Bố Mẹ Lớn Tuổi",
      "minAge": 36,
      "maxAge": 62,
      "priority": 74,
      "isOneTime": true,
      "description": "Bố mẹ tuổi cao sức yếu phải nhập viện theo dõi một tuần, đòi hỏi con cái sắp xếp công việc thay phiên chăm sóc.",
      "conditions": [],
      "options": [
        {
          "id": "opt_personal_care",
          "label": "Sắp xếp công việc từ xa để trực tiếp túc trực động viên bố mẹ mỗi ngày",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Nhờ tình thương của con cháu, bố mẹ hồi phục nhanh chóng và xuất viện khỏe mạnh!",
              "statModifiers": {
                "parentRelationship": 25,
                "karma": 20,
                "happiness": 15,
                "stress": 8
              }
            }
          ]
        },
        {
          "id": "opt_vip_care_package",
          "label": "Bố trí phòng chăm sóc tốt nhất kết hợp y tá riêng hỗ trợ gia đình",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Bố mẹ được điều trị tận tình chu đáo và hoàn toàn bình phục!",
              "statModifiers": {
                "parentRelationship": 20,
                "karma": 14,
                "happiness": 12
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p4_09_15_year_reunion",
      "category": "culture",
      "title": "Họp Lớp 15 Năm Ngày Ra Trường",
      "minAge": 32,
      "maxAge": 36,
      "priority": 64,
      "isOneTime": true,
      "description": "Sau 15 năm bôn ba, đám bạn cũ tụ họp lại nhà hàng năm xưa. Ai nấy đều thay đổi nhiều so với thời áo trắng.",
      "conditions": [],
      "options": [
        {
          "id": "opt_humble_reunion",
          "label": "Vui vẻ ôn kỷ niệm ngây ngô thuở học trò và kết nối hỗ trợ công việc cho bạn bè",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Sự khiêm nhường và chân thành của bạn giúp buổi họp lớp ấm áp, kết nối được nhiều đối tác tin cậy!",
              "statModifiers": {
                "charisma": 10,
                "happiness": 16,
                "socialStatus": 10,
                "karma": 8
              }
            }
          ]
        },
        {
          "id": "opt_class_fund_sponsor",
          "label": "Đứng ra góp quỹ tri ân thầy cô giáo cũ khó khăn của trường",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Thầy cô rưng rưng xúc động trước nghĩa cử cao đẹp của cả lớp!",
              "statModifiers": {
                "karma": 18,
                "socialStatus": 14,
                "happiness": 15
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p4_10_teen_child_esports",
      "category": "relationship",
      "title": "Con Đòi Nghỉ Học Đi Thi Đấu Game Chuyên Nghiệp",
      "minAge": 42,
      "maxAge": 58,
      "priority": 68,
      "isOneTime": true,
      "description": "Đứa con đang học cấp 3 bất ngờ nói muốn bảo lưu kết quả học tập để theo đuổi giấc mơ tuyển thủ Esports.",
      "conditions": [
        {
          "field": "childrenCount",
          "operatorType": ">=",
          "numberValue": 1
        }
      ],
      "options": [
        {
          "id": "opt_propose_milestone_deal",
          "label": "Lắng nghe tôn trọng và giao kèo: giữ học lực Khá trở lên mới được tham gia giải bán chuyên",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Con bạn mừng rỡ nỗ lực gấp đôi cả học tập lẫn luyện thi, học được trách nhiệm với lựa chọn!",
              "statModifiers": {
                "happiness": 16,
                "discipline": 8,
                "charisma": 8,
                "karma": 8
              }
            }
          ]
        },
        {
          "id": "opt_guide_game_dev",
          "label": "Định hướng con tìm hiểu sâu hơn về lập trình game và kinh doanh công nghệ số",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Con chuyển hướng đam mê thành kỹ năng lập trình xuất sắc đầy triển vọng!",
              "statModifiers": {
                "happiness": 14,
                "intelligence": 6,
                "businessAcuity": 6
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p4_11_rooftop_garden",
      "category": "culture",
      "title": "Cải Tạo Sân Thượng Trồng Rau Sạch & Hoa Hồng",
      "minAge": 34,
      "maxAge": 78,
      "priority": 52,
      "isOneTime": true,
      "description": "Góc sân thượng đầy nắng đang bỏ trống, bạn nghĩ tới việc biến nơi đây thành khu vườn xanh mướt giữa lòng phố thị.",
      "conditions": [],
      "options": [
        {
          "id": "opt_grow_organic_veggies",
          "label": "Tự đóng giàn trồng cà chua, rau muống, mướp hương hữu cơ cho cả nhà",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Mỗi sáng lên vườn tưới cây hít thở không khí trong lành giúp tinh thần thư thái lạ kỳ!",
              "statModifiers": {
                "health": 10,
                "happiness": 14,
                "stress": -15,
                "practicalSkills": 6
              }
            }
          ]
        },
        {
          "id": "opt_koi_tea_corner",
          "label": "Bố trí thêm bộ bàn trà gỗ và hồ cá nhỏ tiếp bạn hiền cuối tuần",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Không gian chill tuyệt vời ngay tại nhà giúp cân bằng cuộc sống đỉnh cao!",
              "statModifiers": {
                "happiness": 16,
                "stress": -16,
                "charisma": 5
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p4_14_japan_sakura_vacation",
      "category": "culture",
      "title": "Chuyến Du Lịch Ngắm Hoa Anh Đào Nhật Bản",
      "minAge": 26,
      "maxAge": 78,
      "priority": 60,
      "isOneTime": true,
      "description": "Bạn quyết định tự thưởng cho bản thân và gia đình một chuyến khám phá Tokyo - Kyoto đúng mùa hoa anh đào nở rộ.",
      "conditions": [
        {
          "field": "cash",
          "operatorType": ">=",
          "numberValue": 80000000
        }
      ],
      "options": [
        {
          "id": "opt_full_family_tour",
          "label": "Chi 60 triệu đồng trải nghiệm chuyến đi trọn vẹn ngắm núi Phú Sĩ và suối nước nóng",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Cả gia đình ngập tràn hạnh phúc, năng lượng và cảm hứng sáng tạo dồi dào trở lại!",
              "statModifiers": {
                "cash": -60000000,
                "happiness": 26,
                "stress": -28,
                "health": 8,
                "parentRelationship": 12
              }
            }
          ]
        },
        {
          "id": "opt_smart_budget_trip",
          "label": "Săn vé sớm tự túc hành trình tối ưu chi phí chỉ 30 triệu mà vẫn đi đủ điểm đẹp",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Chuyến đi tự túc đầy trải nghiệm văn hóa tuyệt vời với chi phí cực kỳ hợp lý!",
              "statModifiers": {
                "cash": -30000000,
                "happiness": 20,
                "stress": -20,
                "practicalSkills": 6
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p4_16_child_introduces_fiance",
      "category": "relationship",
      "title": "Con Dẫn Người Thương Về Ra Mắt Xin Cưới",
      "minAge": 48,
      "maxAge": 68,
      "priority": 78,
      "isOneTime": true,
      "description": "Đứa con trưởng thành của bạn rạng rỡ đưa người yêu về nhà ăn cơm và thưa chuyện trăm năm với bố mẹ.",
      "conditions": [
        {
          "field": "childrenCount",
          "operatorType": ">=",
          "numberValue": 1
        }
      ],
      "options": [
        {
          "id": "opt_bless_couple",
          "label": "Vui vẻ chúc phúc và dạy con bí quyết giữ gìn hạnh phúc hôn nhân",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Đám cưới con diễn ra tưng bừng ấm áp, hai bên thông gia quý mến nhau hết mực!",
              "statModifiers": {
                "happiness": 24,
                "karma": 12,
                "socialStatus": 10
              }
            }
          ]
        },
        {
          "id": "opt_gift_wedding_gold",
          "label": "Trao tặng đôi trẻ chút vốn làm ăn khởi nghiệp đầu đời",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Các con vô cùng cảm động và biết ơn tình yêu thương sâu nặng của bạn!",
              "statModifiers": {
                "happiness": 22,
                "karma": 15,
                "socialStatus": 12
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p4_17_first_grandchild_born",
      "category": "relationship",
      "title": "Lên Chức Ông Bà Đón Cháu Đầu Lòng!",
      "minAge": 50,
      "maxAge": 75,
      "priority": 82,
      "isOneTime": true,
      "description": "Tiếng khóc chào đời của đứa cháu nội/ngoại đầu tiên vang lên ngoài phòng sinh! Niềm vui tuổi xế chiều vỡ òa.",
      "conditions": [
        {
          "field": "childrenCount",
          "operatorType": ">=",
          "numberValue": 1
        }
      ],
      "options": [
        {
          "id": "opt_spoil_grandchild",
          "label": "Bế ẵm cháu cưng trong lòng và kể chuyện cổ tích năm xưa",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Có cháu bồng cháu bế, bạn thấy mình trẻ ra cả chục tuổi!",
              "statModifiers": {
                "happiness": 30,
                "health": 8,
                "stress": -20,
                "karma": 10
              }
            }
          ]
        },
        {
          "id": "opt_teach_grandchild",
          "label": "Lập sẵn quỹ sách và tiết kiệm giáo dục nho nhỏ mừng đầy tháng cháu",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Truyền thống hiếu học gia phong tiếp tục được truyền qua ba thế hệ!",
              "statModifiers": {
                "happiness": 25,
                "karma": 14,
                "socialStatus": 10
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p4_18_ancestral_temple_restore",
      "category": "culture",
      "title": "Chung Tay Trùng Tu Nhà Thờ Họ Quê Hương",
      "minAge": 45,
      "maxAge": 82,
      "priority": 64,
      "isOneTime": true,
      "description": "Các bậc cao niên trong dòng họ bàn bạc tu sửa mái ngói và sân gạch Nhà thờ Tổ đã xuống cấp theo năm tháng.",
      "conditions": [],
      "options": [
        {
          "id": "opt_contribute_ancestral",
          "label": "Đóng góp công sức và tài chính trong khả năng cùng bà con dòng tộc",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Nhà thờ họ khang trang uy nghiêm, tên tuổi và lòng hiếu nghĩa của bạn được con cháu ghi nhớ!",
              "statModifiers": {
                "karma": 22,
                "socialStatus": 16,
                "happiness": 16
              }
            }
          ]
        },
        {
          "id": "opt_compile_genealogy",
          "label": "Phụ trách biên soạn số hóa cuốn Gia phả dòng họ lưu truyền hậu thế",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Cuốn gia phả lưu giữ đầy đủ cội nguồn giúp thế hệ trẻ luôn hướng về quê hương!",
              "statModifiers": {
                "karma": 18,
                "intelligence": 6,
                "socialStatus": 14
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p4_19_retirement_home_choice",
      "category": "culture",
      "title": "Chọn Chốn An Cư Tuổi Hưu",
      "minAge": 60,
      "maxAge": 72,
      "priority": 74,
      "isOneTime": true,
      "description": "Sau nhiều năm tất bật phố thị, bạn cùng người thân chọn nhịp sống lý tưởng để tận hưởng tuổi vàng.",
      "conditions": [],
      "options": [
        {
          "id": "opt_retire_da_nang",
          "label": "Chọn thành phố biển Đà Nẵng nắng ấm trong lành, sáng đi dạo bờ biển",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Không khí biển mặn mòi và nhịp sống hiền hòa giúp sức khỏe bạn cải thiện tuyệt vời!",
              "statModifiers": {
                "health": 14,
                "happiness": 20,
                "stress": -22
              }
            }
          ]
        },
        {
          "id": "opt_retire_da_lat",
          "label": "Chọn cao nguyên Đà Lạt sương mù thông reo trồng hoa và thưởng trà nóng",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Cuộc sống thi vị giữa đồi thông mang lại sự bình yên tuyệt đối trong tâm hồn.",
              "statModifiers": {
                "happiness": 24,
                "stress": -25,
                "health": 10
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p4_21_sponsor_heart_surgery",
      "category": "culture",
      "title": "Quỹ Nhịp Tim Yêu Thương Cứu Trẻ Em Nghèo",
      "minAge": 50,
      "maxAge": 88,
      "priority": 74,
      "isOneTime": true,
      "description": "Bệnh viện tim mạch kêu gọi tài trợ chi phí phẫu thuật cho những em nhỏ mắc bệnh tim bẩm sinh có hoàn cảnh khó khăn.",
      "conditions": [
        {
          "field": "cash",
          "operatorType": ">=",
          "numberValue": 200000000
        }
      ],
      "options": [
        {
          "id": "opt_sponsor_5_surgeries",
          "label": "Tài trợ trọn gói 150 triệu đồng cứu 5 ca phẫu thuật tim cho các bé",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Năm trái tim nhỏ đập khỏe mạnh trở lại! Phúc đức dòng tộc tỏa sáng rạng ngời!",
              "statModifiers": {
                "cash": -150000000,
                "karma": 35,
                "happiness": 28,
                "socialStatus": 22
              }
            }
          ]
        },
        {
          "id": "opt_sponsor_1_surgery",
          "label": "Ủng hộ 30 triệu đồng chung tay cùng chương trình",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Món quà vô giá mang lại phép màu sự sống cho gia đình em nhỏ!",
              "statModifiers": {
                "cash": -30000000,
                "karma": 20,
                "happiness": 18
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p4_22_family_council_estate",
      "category": "finance",
      "title": "Họp Hội Đồng Gia Tộc Chuyển Giao Trách Nhiệm",
      "minAge": 65,
      "maxAge": 85,
      "priority": 78,
      "isOneTime": true,
      "description": "Các con cháu đã vững vàng sự nghiệp, bạn tổ chức cuộc họp gia đình định hướng tầm nhìn phát triển gia sản bền vững qua nhiều thế hệ.",
      "conditions": [
        {
          "field": "childrenCount",
          "operatorType": ">=",
          "numberValue": 1
        }
      ],
      "options": [
        {
          "id": "opt_family_charter",
          "label": "Ban hành Hiến chương Gia tộc đề cao đoàn kết, liêm chính và hiếu học",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Các thế hệ con cháu đồng lòng nhất trí bảo vệ và nhân rộng cơ nghiệp!",
              "statModifiers": {
                "karma": 18,
                "socialStatus": 16,
                "happiness": 20,
                "stress": -15
              },
              "unlockedFlags": [
                "family_trust_protected"
              ]
            }
          ]
        },
        {
          "id": "opt_mentor_heirs",
          "label": "Truyền đạt toàn bộ bí quyết đầu tư và quan hệ đối tác cốt lõi cho người kế thừa",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Thế hệ kế cận sẵn sàng đưa gia tộc vươn tới đỉnh cao mới!",
              "statModifiers": {
                "happiness": 18,
                "businessAcuity": 10
              },
              "unlockedFlags": [
                "heir_elite_trained"
              ]
            }
          ]
        }
      ]
    },
    {
      "eventId": "p4_23_longevity_80_red_banner",
      "category": "culture",
      "title": "Đại Lễ Thượng Thọ Tuổi 80",
      "minAge": 80,
      "maxAge": 82,
      "priority": 90,
      "isOneTime": true,
      "description": "Khắp sân rộn rã tiếng cười con cháu chúc mừng Đại lễ Thượng Thọ Bát Tuần trong sắc lụa đỏ thắm.",
      "conditions": [],
      "options": [
        {
          "id": "opt_bless_descendants",
          "label": "Phát bao lì xì đỏ cầu chúc bình an và truyền lời răn dạy cho cháu chắt",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Không khí đầm ấm kính trên nhường dưới khiến lòng bạn tràn ngập tự hào!",
              "statModifiers": {
                "happiness": 26,
                "health": 8,
                "karma": 15
              }
            }
          ]
        },
        {
          "id": "opt_share_life_wisdom",
          "label": "Kể lại hành trình từ hai bàn tay trắng thời trẻ để tiếp lửa cho con cháu",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Câu chuyện nghị lực sống của bạn trở thành huyền thoại truyền đời trong gia tộc!",
              "statModifiers": {
                "socialStatus": 16,
                "happiness": 22
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p4_25_pass_down_heirloom",
      "category": "relationship",
      "title": "Trao Kỷ Vật Gia Bảo Cho Thế Hệ Sau",
      "minAge": 75,
      "maxAge": 92,
      "priority": 74,
      "isOneTime": true,
      "description": "Bạn mở chiếc hộp gỗ quý cất giữ cuốn sổ ghi chép đầu đời và chiếc đồng hồ kỷ niệm để trao lại cho thế hệ con cháu.",
      "conditions": [],
      "options": [
        {
          "id": "opt_gift_diary_lessons",
          "label": "Trao cuốn nhật ký bài học làm giàu chân chính và giữ chữ Tín",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Kho báu tinh thần vô giá được thế hệ trẻ nâng niu trân trọng!",
              "statModifiers": {
                "karma": 20,
                "happiness": 22,
                "socialStatus": 12
              }
            }
          ]
        },
        {
          "id": "opt_host_family_feast",
          "label": "Tổ chức bữa cơm đoàn viên ấm cúng tụ họp đầy đủ mọi thành viên",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Gia đình thuận hòa là di sản rực rỡ nhất của cả một đời người!",
              "statModifiers": {
                "happiness": 25,
                "karma": 15,
                "health": 5
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p4_26_four_generations_90",
      "category": "culture",
      "title": "Đại Thọ 90 Tuổi — Tứ Đại Đồng Đường",
      "minAge": 88,
      "maxAge": 96,
      "priority": 92,
      "isOneTime": true,
      "description": "Cả bốn thế hệ con cháu chắt sum vầy chụp bức ảnh đại gia đình kỷ niệm cột mốc Đại thọ hiếm có!",
      "conditions": [],
      "options": [
        {
          "id": "opt_grand_photo_smile",
          "label": "Mỉm cười viên mãn giữa vòng tay yêu thương của bốn thế hệ",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Một cuộc đời trọn vẹn, rực rỡ và đáng tự hào lưu danh mãi trong sử gia tộc!",
              "statModifiers": {
                "happiness": 35,
                "karma": 25,
                "health": 10,
                "socialStatus": 20
              }
            }
          ]
        },
        {
          "id": "opt_wish_peace_all",
          "label": "Chúc phúc cho thế hệ tương lai tiếp tục viết tiếp huyền thoại Tỷ phú Việt!",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Ngọn lửa khát vọng vươn lên rực sáng truyền qua nhiều thế hệ nối tiếp!",
              "statModifiers": {
                "happiness": 30,
                "karma": 30,
                "stress": -20
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p3_01_meme_coin_fomo",
      "category": "finance",
      "title": "Cơn Sốt Tiền Số Lúc 2 Giờ Sáng",
      "minAge": 20,
      "maxAge": 42,
      "priority": 62,
      "isOneTime": true,
      "description": "Hội nhóm đầu tư nửa đêm xôn xao về một đồng coin hình chú chó vừa tăng 400% trong 3 tiếng và hô hào 'chỉ có tăng không giảm'.",
      "conditions": [
        {
          "field": "cash",
          "operatorType": ">=",
          "numberValue": 20000000
        }
      ],
      "options": [
        {
          "id": "opt_avoid_fomo_meme",
          "label": "Tắt điện thoại đi ngủ đúng giờ, không chạy theo sóng đầu cơ vô giá trị",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Sáng hôm sau mở máy thấy đồng coin đó bốc hơi 95% giá trị! Quyết định quá sáng suốt!",
              "statModifiers": {
                "financialLiteracy": 12,
                "discipline": 10,
                "health": 5
              }
            }
          ]
        },
        {
          "id": "opt_tiny_fun_bet",
          "label": "Chỉ trích đúng 5 triệu tiền lãi dự phòng để thử nghiệm công nghệ blockchain",
          "outcomes": [
            {
              "probability": 0.4,
              "message": "Thoát kịp trước khi đội tạo lập xả hàng, bỏ túi nhẹ nhàng 18 triệu!",
              "statModifiers": {
                "cash": 18000000,
                "happiness": 10
              }
            },
            {
              "probability": 0.6,
              "message": "Thanh khoản biến mất, coi như đóng học phí nhẹ 5 triệu không ảnh hưởng vốn gốc.",
              "statModifiers": {
                "cash": -5000000,
                "financialLiteracy": 10
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p3_03_suburb_land_auction",
      "category": "finance",
      "title": "Phiên Đấu Giá Đất Nền Ven Đô Nghẹt Thở",
      "minAge": 26,
      "maxAge": 60,
      "priority": 72,
      "isOneTime": true,
      "description": "Hội trường đấu giá huyện ngoại thành chật kín hàng trăm nhà đầu tư. Bạn đã khảo sát kỹ quy hoạch tuyến đường sắt đô thị mới.",
      "conditions": [
        {
          "field": "cash",
          "operatorType": ">=",
          "numberValue": 300000000
        }
      ],
      "options": [
        {
          "id": "opt_disciplined_ceiling",
          "label": "Đặt mức giá trần theo đúng định giá thực tế, không để cảm xúc cuốn theo đám đông",
          "outcomes": [
            {
              "probability": 0.75,
              "conditionFormula": "financialLiteracy >= 40",
              "message": "Trúng đấu giá đúng mức giá hời! Sáu tháng sau có người hỏi mua chênh ngay 220 triệu!",
              "statModifiers": {
                "cash": 220000000,
                "financialLiteracy": 12,
                "socialStatus": 10
              }
            },
            {
              "probability": 0.25,
              "message": "Giá bị đẩy lên quá ảo nên bạn dừng lại bảo toàn vốn, tìm được lô đẹp hơn ở xã kế bên.",
              "statModifiers": {
                "cash": 65000000,
                "discipline": 10
              }
            }
          ]
        },
        {
          "id": "opt_partner_syndicate",
          "label": "Liên kết góp vốn cùng hai nhà đầu tư sành sỏi chia sẻ rủi ro",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Thương vụ hợp tác suôn sẻ mang về khoản lợi nhuận ròng chắc chắn!",
              "statModifiers": {
                "cash": 135000000,
                "businessAcuity": 10
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p3_04_tenant_ghosted_rent",
      "category": "finance",
      "title": "Khách Thuê Bỏ Trốn Nợ Tiền Nhà",
      "minAge": 26,
      "maxAge": 65,
      "priority": 58,
      "isOneTime": true,
      "description": "Người thuê phòng trọ / căn hộ bất ngờ khóa máy điện thoại và dọn đồ đi lúc nửa đêm để lại hóa đơn điện nước chưa thanh toán.",
      "conditions": [],
      "options": [
        {
          "id": "opt_standardize_deposit",
          "label": "Khấu trừ tiền cọc và thiết lập hợp đồng công chứng + thu cọc 2 tháng chuẩn mực",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Tiền cọc đủ bù chi phí sửa sang và bạn tìm được khách thuê mới uy tín ngay tuần sau!",
              "statModifiers": {
                "financialLiteracy": 10,
                "practicalSkills": 8,
                "cash": 5000000
              }
            }
          ]
        },
        {
          "id": "opt_smart_lock_upgrade",
          "label": "Lắp khóa vân tay quản lý từ xa và xuất hóa đơn tự động hàng tháng",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Quản lý bất động sản cho thuê chuyên nghiệp không cần tốn công đi thu từng phòng!",
              "statModifiers": {
                "businessAcuity": 10,
                "stress": -8
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p3_06_bank_rate_hike",
      "category": "finance",
      "title": "Ngân Hàng Điều Chỉnh Lãi Suất Thả Nổi",
      "minAge": 25,
      "maxAge": 65,
      "priority": 62,
      "isOneTime": true,
      "description": "Chu kỳ lãi suất thị trường nhích tăng khiến các doanh nghiệp dùng đòn bẩy cao bắt đầu gặp áp lực dòng tiền.",
      "conditions": [],
      "options": [
        {
          "id": "opt_negotiate_fixed_rate",
          "label": "Chủ động đàm phán chuyển sang gói lãi suất ưu đãi cố định hoặc tất toán bớt nợ",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Cấu trúc tài chính an toàn giúp bạn nhẹ gánh chi phí lãi vay suốt 2 năm!",
              "statModifiers": {
                "financialLiteracy": 12,
                "stress": -10,
                "discipline": 8
              }
            }
          ]
        },
        {
          "id": "opt_high_yield_deposit",
          "label": "Tận dụng lãi suất huy động cao gửi kỳ hạn hưởng lợi suất an toàn",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Tiền nhàn rỗi sinh lời ổn định không chút âu lo!",
              "statModifiers": {
                "cash": 25000000,
                "financialLiteracy": 8
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p3_07_antique_vase_attic",
      "category": "culture",
      "title": "Phát Hiện Chiếc Bình Gốm Cổ Khi Sửa Nhà Quê",
      "minAge": 24,
      "maxAge": 75,
      "priority": 55,
      "isOneTime": true,
      "description": "Trong lúc phụ dọn lại căn gác gỗ cũ ở quê, bạn thấy một chiếc bình gốm men ngọc phủ bụi có hoa văn tinh xảo lạ mắt.",
      "conditions": [],
      "options": [
        {
          "id": "opt_appraise_museum",
          "label": "Mời chuyên gia cổ vật thẩm định nguồn gốc minh bạch",
          "outcomes": [
            {
              "probability": 0.45,
              "conditionFormula": "luck >= 55",
              "message": "Bất ngờ lớn! Cổ vật quý được nhà sưu tầm trả giá hậu hĩnh để lưu giữ!",
              "statModifiers": {
                "cash": 180000000,
                "happiness": 22
              }
            },
            {
              "probability": 0.55,
              "message": "Là đồ gốm thủ công thế hệ ông cha để lại, bạn lau sạch đặt trang trọng ở phòng khách.",
              "statModifiers": {
                "happiness": 10,
                "karma": 8
              }
            }
          ]
        },
        {
          "id": "opt_keep_family_heirloom",
          "label": "Giữ nguyên làm kỷ vật gia bảo truyền lại cho con cháu",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Nét đẹp truyền thống làm căn nhà thêm phần trang nhã và ấm cúng.",
              "statModifiers": {
                "karma": 10,
                "parentRelationship": 12,
                "happiness": 10
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p3_08_old_classmate_pitch",
      "category": "relationship",
      "title": "Bạn Cũ 10 Năm Bỗng Nhắn: 'Dạo Này Khỏe Không?'",
      "minAge": 25,
      "maxAge": 48,
      "priority": 56,
      "isOneTime": true,
      "description": "Một người bạn cấp 3 mất liên lạc gần chục năm đột nhiên nhắn tin hỏi thăm rồi hẹn cà phê giới thiệu 'cơ hội đầu tư dự án nghìn tỷ'.",
      "conditions": [],
      "options": [
        {
          "id": "opt_check_legal_first",
          "label": "Từ chối khéo lời mời đầu tư mù mờ, chỉ giữ phép lịch sự hỏi thăm",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Bạn tránh được màn mời chào bảo hiểm/dự án ma mất thời gian mà vẫn giữ hòa khí!",
              "statModifiers": {
                "financialLiteracy": 10,
                "charisma": 6
              }
            }
          ]
        },
        {
          "id": "opt_vet_real_business",
          "label": "Yêu cầu gửi hồ sơ pháp lý và báo cáo doanh thu thật trước khi gặp",
          "outcomes": [
            {
              "probability": 0.35,
              "message": "Hóa ra bạn ấy mở xưởng sản xuất thật đang tìm nhà phân phối! Bạn ký được nguồn hàng tốt.",
              "statModifiers": {
                "cash": 40000000,
                "businessAcuity": 10
              }
            },
            {
              "probability": 0.65,
              "message": "Đối phương lập tức im bặt khi nghe nhắc tới kiểm toán! Rõ ràng là dự án bánh vẽ.",
              "statModifiers": {
                "financialLiteracy": 10,
                "intelligence": 5
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p3_09_shark_tank_pitch",
      "category": "finance",
      "title": "Lên Sóng Gọi Vốn Trước Hội Đồng Cá Mập",
      "minAge": 24,
      "maxAge": 52,
      "priority": 78,
      "isOneTime": true,
      "description": "Bạn đứng dưới ánh đèn sân khấu trình bày mô hình kinh doanh trước 5 nhà đầu tư triệu đô sành sỏi nhất thương trường.",
      "conditions": [
        {
          "field": "cash",
          "operatorType": ">=",
          "numberValue": 200000000
        }
      ],
      "options": [
        {
          "id": "opt_sharp_valuation",
          "label": "Bảo vệ định giá bằng số liệu tăng trưởng thật và chốt deal cổ phần hợp lý",
          "outcomes": [
            {
              "probability": 0.72,
              "conditionFormula": "businessAcuity >= 40",
              "message": "CẢ 3 CÁ MẬP TRANH NHAU RÓT VỐN! Bạn nhận vốn chiến lược 800 triệu và bùng nổ thị trường!",
              "statModifiers": {
                "cash": 800000000,
                "socialStatus": 22,
                "businessAcuity": 18,
                "happiness": 24
              }
            },
            {
              "probability": 0.28,
              "message": "Không chốt được deal trên sóng nhưng hiệu ứng truyền thông giúp doanh số tăng gấp đôi!",
              "statModifiers": {
                "cash": 180000000,
                "socialStatus": 14
              }
            }
          ]
        },
        {
          "id": "opt_bootstrap_pride",
          "label": "Chỉ lên quảng bá sản phẩm, giữ 100% cổ phần tự lực phát triển",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Khán giả ấn tượng mạnh trước bản lĩnh tự chủ của bạn, đơn đặt hàng đổ về tới tấp!",
              "statModifiers": {
                "cash": 240000000,
                "socialStatus": 15,
                "discipline": 8
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p3_10_dalat_hydroponic_farm",
      "category": "finance",
      "title": "Đầu Tư Nông Trại Công Nghệ Cao Đà Lạt",
      "minAge": 26,
      "maxAge": 65,
      "priority": 68,
      "isOneTime": true,
      "description": "Một kỹ sư nông nghiệp mời bạn hợp tác 300 triệu xây nhà kính trồng dâu tây Nhật và rau thủy canh cung cấp siêu thị sạch.",
      "conditions": [
        {
          "field": "cash",
          "operatorType": ">=",
          "numberValue": 300000000
        }
      ],
      "options": [
        {
          "id": "opt_invest_smart_farm",
          "label": "Rót 300 triệu lắp hệ thống tưới nhỏ giọt IoT và ký bao tiêu siêu thị",
          "outcomes": [
            {
              "probability": 0.8,
              "message": "Nông sản sạch đạt chuẩn xuất hiện khắp hệ thống siêu thị, mang về lợi nhuận bền vững!",
              "statModifiers": {
                "cash": 420000000,
                "happiness": 14,
                "karma": 8,
                "businessAcuity": 12
              }
            },
            {
              "probability": 0.2,
              "message": "Đợt sương muối cuối năm làm sản lượng giảm nhẹ nhưng vẫn thu lãi dương.",
              "statModifiers": {
                "cash": 60000000,
                "practicalSkills": 8
              }
            }
          ]
        },
        {
          "id": "opt_ecotourism_combo",
          "label": "Kết hợp mở điểm tham quan hái dâu check-in cuối tuần cho khách du lịch",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Dòng tiền kép từ vé tham quan và nông sản giúp nông trại thành công rực rỡ!",
              "statModifiers": {
                "cash": 350000000,
                "businessAcuity": 14,
                "happiness": 15
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p3_12_boundary_dispute",
      "category": "relationship",
      "title": "Tranh Chấp 0.5m Ranh Giới Tường Rào",
      "minAge": 30,
      "maxAge": 68,
      "priority": 55,
      "isOneTime": true,
      "description": "Hàng xóm xây lại bờ rào và lỡ xây lấn sang phần sân nhà bạn nửa mét đất theo sổ đỏ cũ.",
      "conditions": [],
      "options": [
        {
          "id": "opt_geodesy_dialogue",
          "label": "Mời cán bộ địa chính đo đạc chuẩn xác kèm buổi nói chuyện ôn hòa dĩ hòa vi quý",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Hàng xóm nhận ra sai sót kỹ thuật của thợ xây và tự nguyện chỉnh lại tường, giữ trọn tình làng nghĩa xóm!",
              "statModifiers": {
                "charisma": 10,
                "karma": 10,
                "socialStatus": 8
              }
            }
          ]
        },
        {
          "id": "opt_swap_agreement",
          "label": "Thỏa thuận chuyển nhượng hoặc hoán đổi gọn gàng bằng văn bản công chứng",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Hàng xóm trả phần chênh lệch sòng phẳng nhanh gọn trong 1 ngày!",
              "statModifiers": {
                "cash": 35000000,
                "financialLiteracy": 6
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p3_13_health_insurance_shield",
      "category": "finance",
      "title": "Tấm Khiên Bảo Vệ Sức Khỏe Gia Đình",
      "minAge": 26,
      "maxAge": 58,
      "priority": 60,
      "isOneTime": true,
      "description": "Công việc ngày càng bận rộn khiến bạn cân nhắc mua gói thẻ chăm sóc sức khỏe toàn diện tại bệnh viện quốc tế.",
      "conditions": [
        {
          "field": "cash",
          "operatorType": ">=",
          "numberValue": 30000000
        }
      ],
      "options": [
        {
          "id": "opt_buy_health_card",
          "label": "Chi 18 triệu sở hữu thẻ bảo lãnh viện phí cao cấp trong năm",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "An tâm tuyệt đối trước mọi rủi ro ốm đau đột xuất và được khám định kỳ miễn phí!",
              "statModifiers": {
                "cash": -18000000,
                "health": 12,
                "stress": -12,
                "financialLiteracy": 8
              },
              "unlockedFlags": [
                "has_premium_health_shield"
              ]
            }
          ]
        },
        {
          "id": "opt_emergency_fund",
          "label": "Tự lập sổ tiết kiệm quỹ dự phòng khẩn cấp tương đương 6 tháng chi tiêu",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Kỷ luật tài chính vững vàng giúp bạn luôn ngủ ngon trước mọi biến cố!",
              "statModifiers": {
                "discipline": 10,
                "financialLiteracy": 10,
                "stress": -8
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p3_14_green_datacenter_infra",
      "category": "finance",
      "title": "Góp Vốn Hạ Tầng Trung Tâm Dữ Liệu Xanh AI",
      "minAge": 32,
      "maxAge": 70,
      "priority": 76,
      "isOneTime": true,
      "description": "Một liên doanh công nghệ mời bạn góp 1 tỷ đồng xây dựng trung tâm dữ liệu năng lượng sạch phục vụ điện toán đám mây.",
      "conditions": [
        {
          "field": "cash",
          "operatorType": ">=",
          "numberValue": 1000000000
        }
      ],
      "options": [
        {
          "id": "opt_fund_datacenter",
          "label": "Ký hợp đồng góp vốn 1 tỷ đồng đón làn sóng hạ tầng số quốc gia",
          "outcomes": [
            {
              "probability": 0.82,
              "conditionFormula": "intelligence >= 65",
              "message": "Công suất thuê kín 100% từ các tập đoàn AI! Bạn nhận cổ tức và phần tăng giá trị gấp đôi!",
              "statModifiers": {
                "cash": 1350000000,
                "socialStatus": 20,
                "businessAcuity": 15,
                "happiness": 20
              }
            },
            {
              "probability": 0.18,
              "message": "Thời gian thu hồi vốn kéo dài hơn 1 năm nhưng vẫn sinh lãi ròng bền vững.",
              "statModifiers": {
                "cash": 220000000,
                "financialLiteracy": 8
              }
            }
          ]
        },
        {
          "id": "opt_become_supplier",
          "label": "Không góp vốn lớn — nhận thầu cung cấp giải pháp làm mát và vận hành",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Thu tiền dịch vụ B2B đều đặn không lo rủi ro vốn lớn!",
              "statModifiers": {
                "cash": 380000000,
                "businessAcuity": 12
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p3_15_acquire_rival_firm",
      "category": "finance",
      "title": "Thâu Tóm Đối Thủ Đang Kiệt Quệ Dòng Tiền",
      "minAge": 32,
      "maxAge": 65,
      "priority": 74,
      "isOneTime": true,
      "description": "Một doanh nghiệp cùng ngành sở hữu tệp khách hàng đẹp nhưng quản trị yếu kém đang rao bán lại toàn bộ với giá 500 triệu.",
      "conditions": [
        {
          "field": "cash",
          "operatorType": ">=",
          "numberValue": 500000000
        }
      ],
      "options": [
        {
          "id": "opt_buyout_merge",
          "label": "Chi 500 triệu mua lại và sáp nhập tái cấu trúc toàn bộ quy trình",
          "outcomes": [
            {
              "probability": 0.8,
              "conditionFormula": "businessAcuity >= 45",
              "message": "Thương vụ M&A hoàn hảo! Thị phần của bạn tăng vọt, lợi nhuận ròng tăng mạnh!",
              "statModifiers": {
                "cash": 780000000,
                "businessAcuity": 18,
                "socialStatus": 18
              }
            },
            {
              "probability": 0.2,
              "message": "Mất khá nhiều công sức hòa nhập nhân sự nhưng tài sản thu về vẫn có lãi.",
              "statModifiers": {
                "cash": 120000000,
                "stress": 14
              }
            }
          ]
        },
        {
          "id": "opt_buy_customer_list",
          "label": "Chỉ mua lại thương hiệu và tệp khách hàng giá 180 triệu",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Thương vụ gọn nhẹ giúp doanh thu tăng 40% mà không phải gánh nợ cũ của họ!",
              "statModifiers": {
                "cash": 320000000,
                "financialLiteracy": 12
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p3_17_semiconductor_fdi_wave",
      "category": "finance",
      "title": "Đón Sóng Tập Đoàn Bán Dẫn Toàn Cầu",
      "minAge": 34,
      "maxAge": 70,
      "priority": 80,
      "isOneTime": true,
      "description": "Một tập đoàn chip bán dẫn hàng đầu thế giới công bố đầu tư nhà máy tỷ đô, kéo theo nhu cầu mặt bằng phụ trợ và nhà ở chuyên gia tăng vọt.",
      "conditions": [
        {
          "field": "cash",
          "operatorType": ">=",
          "numberValue": 2000000000
        }
      ],
      "options": [
        {
          "id": "opt_build_expert_housing",
          "label": "Đầu tư 2 tỷ phát triển tổ hợp căn hộ dịch vụ cao cấp cho chuyên gia nước ngoài",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Tỉ lệ lấp đầy đạt 98% quanh năm với giá thuê tính bằng USD! Tài sản tăng giá vùn vụt!",
              "statModifiers": {
                "cash": 2800000000,
                "socialStatus": 24,
                "businessAcuity": 15,
                "happiness": 20
              }
            }
          ]
        },
        {
          "id": "opt_supply_logistics",
          "label": "Đầu tư đội xe và kho vận đạt chuẩn phòng sạch phục vụ khu công nghiệp",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Trở thành đối tác chuỗi cung ứng chiến lược mang về lợi nhuận khủng mỗi năm!",
              "statModifiers": {
                "cash": 1900000000,
                "businessAcuity": 16
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p3_18_pickleball_courts_boom",
      "category": "finance",
      "title": "Đầu Tư Cụm Sân Pickleball Đón Trào Lưu Đô Thị",
      "minAge": 23,
      "maxAge": 55,
      "priority": 64,
      "isOneTime": true,
      "description": "Cả thành phố đang phát cuồng bộ môn Pickleball, sân nào cũng kín lịch từ 5 giờ sáng đến 11 giờ đêm.",
      "conditions": [
        {
          "field": "cash",
          "operatorType": ">=",
          "numberValue": 150000000
        }
      ],
      "options": [
        {
          "id": "opt_open_pickleball_club",
          "label": "Thuê bãi đất trống đầu tư 150 triệu làm cụm 6 sân thảm chuẩn kèm quầy nước",
          "outcomes": [
            {
              "probability": 0.82,
              "message": "Khách đặt sân kín lịch qua app mỗi ngày! Chỉ 8 tháng bạn đã thu hồi trọn vốn và lãi đậm!",
              "statModifiers": {
                "cash": 210000000,
                "health": 8,
                "businessAcuity": 12,
                "happiness": 14
              }
            },
            {
              "probability": 0.18,
              "message": "Cạnh tranh khu vực tăng nhanh nhưng nhờ dịch vụ chu đáo vẫn có lời ổn định.",
              "statModifiers": {
                "cash": 45000000,
                "health": 6
              }
            }
          ]
        },
        {
          "id": "opt_sell_rackets_gear",
          "label": "Không mở sân — nhập vợt chính hãng và phụ kiện thời trang thể thao bán online",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Vốn quay vòng cực nhanh, bạn bán hết sạch lô hàng chỉ trong 3 tuần!",
              "statModifiers": {
                "cash": 95000000,
                "businessAcuity": 10
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p3_19_tet_cinema_investment",
      "category": "finance",
      "title": "Góp Vốn Sản Xuất Phim Điện Ảnh Chiếu Tết",
      "minAge": 28,
      "maxAge": 65,
      "priority": 66,
      "isOneTime": true,
      "description": "Một đạo diễn triệu view mời bạn góp 500 triệu làm nhà đầu tư đồng sản xuất bộ phim hài - gia đình chiếu rạp Mùng 1 Tết.",
      "conditions": [
        {
          "field": "cash",
          "operatorType": ">=",
          "numberValue": 500000000
        }
      ],
      "options": [
        {
          "id": "opt_invest_tet_movie",
          "label": "Đọc kỹ kịch bản nhân văn chạm tim khán giả rồi xuống tiền 500 triệu",
          "outcomes": [
            {
              "probability": 0.65,
              "conditionFormula": "intelligence >= 60",
              "message": "DOANH THU PHÒNG VÉ VƯỢT 250 TỶ! Tên bạn xuất hiện trên thảm đỏ và khoản cổ tức nhân gần gấp 3!",
              "statModifiers": {
                "cash": 950000000,
                "socialStatus": 22,
                "happiness": 22
              }
            },
            {
              "probability": 0.35,
              "message": "Phim hòa vốn phòng vé nhưng thu hồi đủ gốc qua bản quyền chiếu nền tảng trực tuyến.",
              "statModifiers": {
                "cash": 50000000,
                "socialStatus": 10
              }
            }
          ]
        },
        {
          "id": "opt_brand_placement",
          "label": "Chỉ tài trợ nhỏ 80 triệu đặt logo thương hiệu xuất hiện tự nhiên trong phim",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Hình ảnh thương hiệu phủ sóng khắp rạp toàn quốc mang lại lượng khách hàng lớn!",
              "statModifiers": {
                "cash": 140000000,
                "businessAcuity": 10
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p3_20_distressed_condo_hunt",
      "category": "finance",
      "title": "Thị Trường Trầm Lắng — Săn Căn Hộ Cắt Lỗ",
      "minAge": 28,
      "maxAge": 68,
      "priority": 72,
      "isOneTime": true,
      "description": "Lúc thị trường đóng băng thanh khoản, một chủ nhà cần tiền gấp rao bán căn hộ trung tâm thấp hơn giá trị thực 30%.",
      "conditions": [
        {
          "field": "cash",
          "operatorType": ">=",
          "numberValue": 800000000
        }
      ],
      "options": [
        {
          "id": "opt_buy_value_dip",
          "label": "Thẩm định sổ hồng sạch sẽ và giải ngân ngay 800 triệu mua vào",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Vài tháng sau thị trường hồi phục ấm lại, giá trị tài sản tăng ngay 450 triệu!",
              "statModifiers": {
                "cash": 450000000,
                "financialLiteracy": 14,
                "socialStatus": 12
              }
            }
          ]
        },
        {
          "id": "opt_flip_renovate",
          "label": "Bỏ thêm công cải tạo nội thất Bắc Âu sang trọng rồi cho thuê giá cao",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Căn hộ cho thuê kín khách ngay ngày đầu đăng tin với dòng tiền đều đặn!",
              "statModifiers": {
                "cash": 320000000,
                "practicalSkills": 10,
                "happiness": 14
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p3_21_coffee_durian_export",
      "category": "finance",
      "title": "Hợp Đồng Xuất Khẩu Nông Sản Đặc Sản Sang Châu Âu",
      "minAge": 27,
      "maxAge": 62,
      "priority": 70,
      "isOneTime": true,
      "description": "Cà phê đặc sản Tây Nguyên và sầu riêng cấp đông Việt Nam đang được siêu thị châu Âu săn đón với giá cao gấp nhiều lần.",
      "conditions": [
        {
          "field": "cash",
          "operatorType": ">=",
          "numberValue": 400000000
        }
      ],
      "options": [
        {
          "id": "opt_export_eu_container",
          "label": "Đầu tư 400 triệu chuẩn hóa truy xuất nguồn gốc và xuất container đầu tiên",
          "outcomes": [
            {
              "probability": 0.85,
              "message": "Lô hàng thông quan trót lọt và cháy hàng tại Berlin & Paris! Lợi nhuận ròng bứt phá!",
              "statModifiers": {
                "cash": 560000000,
                "socialStatus": 18,
                "businessAcuity": 14,
                "karma": 10
              }
            },
            {
              "probability": 0.15,
              "message": "Phí kiểm dịch tăng nhưng vẫn có lãi và mở đường xuất khẩu lâu dài.",
              "statModifiers": {
                "cash": 90000000,
                "practicalSkills": 10
              }
            }
          ]
        },
        {
          "id": "opt_domestic_boutique",
          "label": "Tập trung phân phối hộp quà nông sản cao cấp phục vụ doanh nghiệp trong nước",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Đơn đặt hàng quà tặng doanh nghiệp cuối năm mang về doanh thu ổn định!",
              "statModifiers": {
                "cash": 210000000,
                "businessAcuity": 10
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p3_22_warehouse_short_circuit",
      "category": "finance",
      "title": "Sự Cố Chập Điện Nhỏ Tại Kho Hàng",
      "minAge": 28,
      "maxAge": 65,
      "priority": 56,
      "isOneTime": true,
      "description": "Hệ thống cảm biến báo khói phát cảnh báo chập bảng điện tại kho hàng lúc rạng sáng.",
      "conditions": [],
      "options": [
        {
          "id": "opt_auto_sprinkler_win",
          "label": "Nhờ hệ thống cảm biến & bảo vệ xử lý tức thì nên thiệt hại gần như bằng 0",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Quy trình an toàn nghiêm ngặt giúp bạn bảo toàn toàn bộ hàng hóa triệu đô!",
              "statModifiers": {
                "discipline": 10,
                "stress": -6,
                "practicalSkills": 8
              }
            }
          ]
        },
        {
          "id": "opt_rewire_modern",
          "label": "Thay mới toàn bộ hệ thống tủ điện thông minh chống quá tải",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Kho hàng vận hành an toàn tuyệt đối đạt chuẩn bảo hiểm quốc tế.",
              "statModifiers": {
                "practicalSkills": 10,
                "discipline": 8
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p3_24_heritage_villa_restaurant",
      "category": "finance",
      "title": "Trùng Tu Biệt Thự Cổ Làm Nhà Hàng Tinh Hoa",
      "minAge": 34,
      "maxAge": 68,
      "priority": 74,
      "isOneTime": true,
      "description": "Cơ hội sở hữu quyền khai thác một căn biệt thự kiến trúc Đông Dương tuyệt đẹp giữa trung tâm quận nhất làm nhà hàng fine-dining.",
      "conditions": [
        {
          "field": "cash",
          "operatorType": ">=",
          "numberValue": 3000000000
        }
      ],
      "options": [
        {
          "id": "opt_michelin_ambition",
          "label": "Đầu tư 3 tỷ đồng nâng tầm ẩm thực Việt chinh phục chuẩn Michelin",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Nhà hàng lọt danh sách Michelin Selected! Giới doanh nhân và khách quốc tế đặt bàn kín cả tháng!",
              "statModifiers": {
                "cash": 2600000000,
                "socialStatus": 28,
                "happiness": 24,
                "businessAcuity": 16
              }
            }
          ]
        },
        {
          "id": "opt_luxury_art_cafe",
          "label": "Kết hợp không gian triển lãm nghệ thuật & cà phê đặc sản Việt",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Điểm hẹn văn hóa sang trọng bậc nhất thành phố thu dòng tiền đều đặn!",
              "statModifiers": {
                "cash": 1500000000,
                "socialStatus": 20,
                "charisma": 10
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p3_25_pe_fund_20_percent",
      "category": "finance",
      "title": "Quỹ Đầu Tư Ngoại Đề Nghị Mua 20% Cổ Phần",
      "minAge": 35,
      "maxAge": 72,
      "priority": 82,
      "isOneTime": true,
      "description": "Một quỹ Private Equity hàng đầu châu Á thẩm định xong hệ thống kinh doanh của bạn và đưa ra đề nghị rót hàng chục tỷ đồng.",
      "conditions": [
        {
          "field": "cash",
          "operatorType": ">=",
          "numberValue": 5000000000
        }
      ],
      "options": [
        {
          "id": "opt_cashout_partial_scale",
          "label": "Bán 20% cổ phần thu tiền mặt lớn và giữ 80% quyền điều hành mở rộng khu vực",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Thương vụ lịch sử đưa khối tài sản của bạn vọt lên tầm Đại gia Hàng chục Tỷ!",
              "statModifiers": {
                "cash": 18000000000,
                "socialStatus": 30,
                "businessAcuity": 18,
                "happiness": 25
              }
            }
          ]
        },
        {
          "id": "opt_ipo_preparation",
          "label": "Hẹn quỹ ngoại đồng hành chuẩn bị niêm yết sàn chứng khoán năm tới",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Định giá doanh nghiệp tăng vọt trước thềm IPO!",
              "statModifiers": {
                "cash": 12000000000,
                "financialLiteracy": 16,
                "socialStatus": 25
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p3_26_angel_fund_founder",
      "category": "finance",
      "title": "Thành Lập Quỹ Đầu Tư Thiên Thần",
      "minAge": 38,
      "maxAge": 78,
      "priority": 84,
      "isOneTime": true,
      "description": "Với tiềm lực tài chính vững mạnh, bạn cân nhắc lập Quỹ Thiên thần ươm mầm các startup công nghệ trẻ Việt Nam.",
      "conditions": [
        {
          "field": "cash",
          "operatorType": ">=",
          "numberValue": 10000000000
        }
      ],
      "options": [
        {
          "id": "opt_back_ai_unicorn",
          "label": "Rót vốn hạt giống vào 3 startup AI & Năng lượng sạch tiềm năng nhất",
          "outcomes": [
            {
              "probability": 0.78,
              "conditionFormula": "businessAcuity >= 50",
              "message": "Một startup bạn rót vốn bứt phá thành Kỳ lân khu vực! Tài sản hoàn trả gấp nhiều lần!",
              "statModifiers": {
                "cash": 45000000000,
                "socialStatus": 35,
                "karma": 15,
                "happiness": 25
              }
            },
            {
              "probability": 0.22,
              "message": "Một dự án tăng trưởng ổn định, mang về lợi nhuận đều và danh tiếng nhà đầu tư mát tay.",
              "statModifiers": {
                "cash": 8000000000,
                "karma": 15,
                "socialStatus": 20
              }
            }
          ]
        },
        {
          "id": "opt_social_impact_fund",
          "label": "Đầu tư vào các dự án giáo dục & y tế cộng đồng bền vững",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Vừa sinh lời bền vững vừa tạo tác động tích cực cho hàng triệu người dân!",
              "statModifiers": {
                "cash": 12000000000,
                "karma": 30,
                "socialStatus": 25,
                "happiness": 25
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p1_01_first_words",
      "category": "childhood",
      "title": "Từ Đầu Tiên Bé Tập Nói",
      "minAge": 1,
      "maxAge": 2,
      "priority": 74,
      "isOneTime": true,
      "description": "Cả nhà hồi hộp vây quanh xem tiếng đầu tiên bạn bật ra rõ ràng nhất là gọi Ba hay gọi Mẹ.",
      "conditions": [],
      "options": [
        {
          "id": "opt_say_mama",
          "label": "Bập bẹ gọi to 'Mẹ ơi!' đầy ngọt ngào",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Mẹ ôm chầm lấy bạn xúc động, còn bố giả vờ dỗi rồi cười xòa.",
              "statModifiers": {
                "parentRelationship": 8,
                "happiness": 8,
                "charisma": 4
              }
            }
          ]
        },
        {
          "id": "opt_say_papa",
          "label": "Chỉ tay ra cổng gọi vang 'Ba!'",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Bố sướng rơn khoe khắp xóm suốt cả tuần lễ!",
              "statModifiers": {
                "parentRelationship": 8,
                "happiness": 8,
                "intelligence": 4
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p1_02_picky_eater",
      "category": "childhood",
      "title": "Cuộc Chiến Bữa Cơm Tuổi Thơ",
      "minAge": 2,
      "maxAge": 4,
      "priority": 65,
      "isOneTime": true,
      "description": "Bạn ngậm miếng cháo trong miệng suốt nửa tiếng không chịu nuốt trong khi bố mẹ phải diễn đủ trò làm xiếc.",
      "conditions": [],
      "options": [
        {
          "id": "opt_eat_bravely",
          "label": "Nuốt cái ực và đòi ăn thêm miếng thịt băm",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Bạn ăn thun thút mau lớn, hai má phúng phính hồng hào!",
              "statModifiers": {
                "health": 10,
                "happiness": 5,
                "discipline": 4
              }
            }
          ]
        },
        {
          "id": "opt_play_spoon",
          "label": "Đòi cầm thìa tự xúc cơm rơi vãi đầy bàn",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Tuy hơi lấm lem nhưng bạn rèn được tính tự lập từ rất sớm!",
              "statModifiers": {
                "practicalSkills": 6,
                "happiness": 7
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p1_03_midautumn_lantern",
      "category": "culture",
      "title": "Đêm Rằm Trung Thu Rước Đèn Ông Sao",
      "minAge": 3,
      "maxAge": 5,
      "priority": 72,
      "isOneTime": true,
      "description": "Ánh trăng rằm sáng vằng vặc, tiếng trống múa lân tùng cheng vang khắp ngõ nhỏ cùng mâm ngũ quả và bánh nướng thơm lừng.",
      "conditions": [],
      "options": [
        {
          "id": "opt_carry_lantern",
          "label": "Cầm đèn ông sao chạy theo đoàn múa lân cùng lũ trẻ trong xóm",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Đêm hội trăng rằm rộn rã tiếng cười trở thành ký ức tuổi thơ tuyệt đẹp!",
              "statModifiers": {
                "happiness": 12,
                "charisma": 6,
                "health": 4
              }
            }
          ]
        },
        {
          "id": "opt_share_mooncake",
          "label": "Nhường phần bánh trung thu nhân thập cẩm cho ông bà và em nhỏ",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Cả nhà đều ấm lòng trước sự hiểu chuyện đáng yêu của bạn.",
              "statModifiers": {
                "karma": 10,
                "parentRelationship": 8,
                "happiness": 8
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p1_04_vaccine_day",
      "category": "childhood",
      "title": "Ngày Đi Tiêm Phòng ở Trạm Y Tế Phường",
      "minAge": 2,
      "maxAge": 5,
      "priority": 62,
      "isOneTime": true,
      "description": "Nhìn thấy cô y tá cầm ống tiêm sáng loáng, mấy bạn nhỏ đứng xếp hàng trước mặt đồng loạt òa khóc nức nở.",
      "conditions": [],
      "options": [
        {
          "id": "opt_brave_shot",
          "label": "Nín thở nhắm mắt dũng cảm tiêm xong cái rẹt không rơi giọt nước mắt",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Cô y tá tặng ngay cho bạn chiếc sticker siêu nhân dũng cảm!",
              "statModifiers": {
                "health": 10,
                "discipline": 8,
                "socialStatus": 4
              }
            }
          ]
        },
        {
          "id": "opt_hug_mom_cry",
          "label": "Khóc ré lên nhưng sau đó hết sốt khỏe mạnh nhanh chóng",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Mẹ dỗ bằng hộp sữa chua mát lạnh giúp bạn quên ngay vết tiêm.",
              "statModifiers": {
                "health": 8,
                "parentRelationship": 6
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p1_06_summer_swimming",
      "category": "childhood",
      "title": "Lớp Học Bơi Mùa Hè Nóng Nực",
      "minAge": 7,
      "maxAge": 11,
      "priority": 68,
      "isOneTime": true,
      "description": "Mùa hè nắng như đổ lửa, bố mẹ đăng ký cho bạn đi học bơi ở bể bơi thiếu nhi gần nhà để tăng chiều cao và kỹ năng sinh tồn.",
      "conditions": [],
      "options": [
        {
          "id": "opt_swim_laps",
          "label": "Chăm chỉ tập bơi ếch và bơi sải không bỏ buổi nào",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Cuối khóa bạn bơi vèo vèo cả chiều dài bể 25m, thể lực tăng vọt!",
              "statModifiers": {
                "health": 12,
                "appearance": 6,
                "discipline": 6,
                "practicalSkills": 6
              }
            }
          ]
        },
        {
          "id": "opt_water_fight",
          "label": "Bơi thì ít mà té nước chơi đùa cùng đám bạn thì nhiều",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Mùa hè sảng khoái tràn đầy năng lượng và tiếng cười!",
              "statModifiers": {
                "happiness": 14,
                "health": 5,
                "charisma": 5
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p1_08_adopt_dog_vang",
      "category": "childhood",
      "title": "Chú Chó Cỏ Tên Vàng",
      "minAge": 6,
      "maxAge": 12,
      "priority": 64,
      "isOneTime": true,
      "description": "Một chú cún con lông vàng bốn mắt ngơ ngác chạy lạc trước cổng nhà bạn giữa buổi chiều mưa lất phất.",
      "conditions": [],
      "options": [
        {
          "id": "opt_keep_care_dog",
          "label": "Xin bố mẹ cho giữ lại nuôi và tự nhận trách nhiệm dọn dẹp cho cún",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Cậu Vàng lớn nhanh thông minh, ngày nào đi học về cũng vẫy đuôi đón bạn từ đầu ngõ!",
              "statModifiers": {
                "happiness": 14,
                "karma": 8,
                "discipline": 6,
                "stress": -8
              }
            }
          ]
        },
        {
          "id": "opt_find_owner",
          "label": "Nhờ bố mẹ đăng tin lên nhóm khu phố tìm lại chủ cũ cho cún",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Bác hàng xóm mừng rơi nước mắt nhận lại cún cưng và cảm ơn bạn rối rít.",
              "statModifiers": {
                "karma": 12,
                "socialStatus": 6,
                "happiness": 8
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p1_12_rice_cooker_oops",
      "category": "childhood",
      "title": "Lần Đầu Tự Cắm Nồi Cơm Điện",
      "minAge": 8,
      "maxAge": 12,
      "priority": 58,
      "isOneTime": true,
      "description": "Bố mẹ về muộn nên dặn bạn vo gạo cắm cơm sẵn. Đến tối cả nhà mở nắp nồi ra thì... gạo vẫn ngâm nguyên trong nước lạnh!",
      "conditions": [],
      "options": [
        {
          "id": "opt_learn_cooking",
          "label": "Cười trừ nhận lỗi quên bật nút nấu, rồi xin mẹ dạy nấu luôn món trứng rán",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Từ bài học nhớ đời đó, bạn sớm thành thạo việc bếp núc tự lập!",
              "statModifiers": {
                "practicalSkills": 10,
                "parentRelationship": 5,
                "happiness": 5
              }
            }
          ]
        },
        {
          "id": "opt_quick_noodle",
          "label": "Nhanh trí úp mì trứng cho cả nhà ăn tạm trong lúc chờ cơm chín",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Bát mì thơm phức nóng hổi cứu nguy đúng lúc khiến cả nhà bật cười!",
              "statModifiers": {
                "practicalSkills": 8,
                "charisma": 5,
                "happiness": 8
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p1_13_school_bully_gate",
      "category": "childhood",
      "title": "Chạm Trán Đám Học Sinh Cá Biệt Cổng Trường",
      "minAge": 11,
      "maxAge": 15,
      "priority": 70,
      "isOneTime": true,
      "description": "Tan học buổi chiều, hai anh lớp trên chặn bạn ở góc tường đòi 'mượn' tiền ăn sáng.",
      "conditions": [],
      "options": [
        {
          "id": "opt_stand_firm_crowd",
          "label": "Bình tĩnh bước vào tiệm tạp hóa đông người lớn gần cổng và báo bảo vệ trường",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Xử lý cực kỳ thông minh và an toàn! Nhóm kia lập tức lủi mất không dám bén mảng lại gần.",
              "statModifiers": {
                "intelligence": 6,
                "discipline": 8,
                "socialStatus": 6
              }
            }
          ]
        },
        {
          "id": "opt_martial_arts_stance",
          "label": "Từng học võ cổ truyền, bạn thủ thế dứt khoát khiến đối phương chùn bước",
          "outcomes": [
            {
              "probability": 0.7,
              "conditionFormula": "health >= 65",
              "message": "Khí thế vững vàng khiến chúng phải nể vài phần mà rút lui.",
              "statModifiers": {
                "health": 4,
                "socialStatus": 10,
                "happiness": 8
              }
            },
            {
              "probability": 0.3,
              "message": "Hai bên xô xát nhẹ trước khi thầy giám thị chạy tới can ngăn.",
              "statModifiers": {
                "health": -5,
                "stress": 10
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p1_14_found_wallet_street",
      "category": "culture",
      "title": "Nhặt Được Chiếc Ví Đánh Rơi Trên Đường",
      "minAge": 10,
      "maxAge": 17,
      "priority": 72,
      "isOneTime": true,
      "description": "Trên đường đạp xe đi học về, bạn thấy một chiếc ví da rơi bên vệ đường bên trong có giấy tờ tùy thân và vài triệu đồng.",
      "conditions": [],
      "options": [
        {
          "id": "opt_return_police",
          "label": "Mang thẳng tới đồn công an phường hoặc liên hệ số điện thoại trong ví trả lại",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Chủ nhân chiếc ví cảm kích trao bạn phần quà cảm ơn nhỏ và nhà trường tuyên dương dưới cờ!",
              "statModifiers": {
                "cash": 300000,
                "karma": 22,
                "socialStatus": 14,
                "happiness": 15
              }
            }
          ]
        },
        {
          "id": "opt_leave_with_guard",
          "label": "Gửi lại bác bảo vệ trường để làm thủ tục thông báo mất đồ",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Người đánh rơi nhận lại đủ giấy tờ ngay trong buổi chiều hôm đó.",
              "statModifiers": {
                "karma": 15,
                "happiness": 10
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p1_16_english_debate",
      "category": "education",
      "title": "Cuộc Thi Hùng Biện Tiếng Anh Toàn Thành",
      "minAge": 12,
      "maxAge": 17,
      "priority": 76,
      "isOneTime": true,
      "description": "CLB Tiếng Anh đề cử bạn đại diện trường dự thi Hùng biện về chủ đề 'Khởi nghiệp Xanh tương lai'.",
      "conditions": [],
      "options": [
        {
          "id": "opt_practice_speech",
          "label": "Luyện phát âm trước gương mỗi ngày và chuẩn bị slide sắc bén",
          "outcomes": [
            {
              "probability": 0.75,
              "conditionFormula": "intelligence >= 60",
              "message": "Phần phản biện tự tin chinh phục ban giám khảo! Bạn giành Huy chương Vàng và học bổng ngoại ngữ!",
              "statModifiers": {
                "intelligence": 10,
                "charisma": 12,
                "socialStatus": 12,
                "cash": 500000
              }
            },
            {
              "probability": 0.25,
              "message": "Bạn lọt vào Top 10 toàn thành phố, trình độ giao tiếp ngoại ngữ tiến bộ vượt bậc.",
              "statModifiers": {
                "intelligence": 7,
                "charisma": 8
              }
            }
          ]
        },
        {
          "id": "opt_support_team",
          "label": "Hỗ trợ nghiên cứu số liệu hậu trường giúp đội trường thi đấu",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Kỹ năng tra cứu tài liệu và làm việc nhóm của bạn được trui rèn sắc bén.",
              "statModifiers": {
                "intelligence": 6,
                "practicalSkills": 8
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p1_17_learn_craft_summer",
      "category": "culture",
      "title": "Học Nghề Truyền Thống Từ Ông Bà Dịp Hè",
      "minAge": 11,
      "maxAge": 16,
      "priority": 60,
      "isOneTime": true,
      "description": "Kỳ nghỉ hè dài, ông bà bảo bạn ra phụ tiệm mộc / làm bánh / sửa đồ truyền thống của gia đình để hiểu giá trị lao động.",
      "conditions": [],
      "options": [
        {
          "id": "opt_master_craft",
          "label": "Xắn tay áo chăm chỉ học từng công đoạn tỉ mỉ",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Ông bà thưởng cho bạn chút tiền công nhỏ cùng sự khéo léo hiếm có!",
              "statModifiers": {
                "practicalSkills": 14,
                "discipline": 10,
                "cash": 400000,
                "karma": 6
              }
            }
          ]
        },
        {
          "id": "opt_sell_online_help",
          "label": "Chụp ảnh đẹp lập fanpage giới thiệu sản phẩm của ông bà cho khách gần xa",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Đơn hàng tăng vọt gấp đôi nhờ tài marketing tuổi teen của bạn!",
              "statModifiers": {
                "businessAcuity": 12,
                "financialLiteracy": 6,
                "cash": 450000
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p1_19_youth_camp_2603",
      "category": "culture",
      "title": "Hội Trại Thanh Niên 26/3 Qua Đêm",
      "minAge": 15,
      "maxAge": 18,
      "priority": 74,
      "isOneTime": true,
      "description": "Sân trường rực rỡ cổng trại tre nứa và ánh lửa trại bập bùng suốt đêm 26/3.",
      "conditions": [],
      "options": [
        {
          "id": "opt_build_camp_gate",
          "label": "Thức trắng dựng cổng trại hoành tráng và biểu diễn đàn guitar bên lửa hồng",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Tuổi thanh xuân rực cháy! Trại lớp bạn giành giải Nhất thiết kế ấn tượng nhất!",
              "statModifiers": {
                "happiness": 15,
                "charisma": 10,
                "practicalSkills": 8,
                "socialStatus": 8
              }
            }
          ]
        },
        {
          "id": "opt_run_food_booth",
          "label": "Mở gian hàng trà tắc & bánh tráng trộn bán gây quỹ cho lớp",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Gian hàng đắt khách cháy hàng chỉ sau 2 tiếng, thu lời ròng cho quỹ lớp và phần thưởng riêng!",
              "statModifiers": {
                "businessAcuity": 12,
                "financialLiteracy": 8,
                "cash": 350000
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p1_20_club_president",
      "category": "education",
      "title": "Tranh Cử Chủ Tịch CLB Kinh Doanh / Công Nghệ Trường",
      "minAge": 16,
      "maxAge": 17,
      "priority": 75,
      "isOneTime": true,
      "description": "Nhiệm kỳ mới bắt đầu, bạn đứng trước cơ hội điều hành CLB lớn nhất trường THPT với hơn 120 thành viên.",
      "conditions": [],
      "options": [
        {
          "id": "opt_run_president",
          "label": "Đưa ra bản kế hoạch hoạt động đột phá và thuyết trình tranh cử",
          "outcomes": [
            {
              "probability": 0.7,
              "conditionFormula": "charisma >= 50",
              "message": "Áp đảo phiếu bầu! Bạn trở thành Chủ tịch CLB, xây dựng kỹ năng lãnh đạo từ tuổi 16.",
              "statModifiers": {
                "charisma": 12,
                "businessAcuity": 10,
                "socialStatus": 14,
                "stress": 8
              },
              "unlockedFlags": [
                "school_club_leader"
              ]
            },
            {
              "probability": 0.3,
              "message": "Bạn đắc cử Phó chủ nhiệm phụ trách chuyên môn, học hỏi được nhiều kinh nghiệm điều phối.",
              "statModifiers": {
                "discipline": 8,
                "charisma": 6
              }
            }
          ]
        },
        {
          "id": "opt_focus_solo_study",
          "label": "Giữ vai trò cố vấn nhẹ nhàng để dành thời gian tập trung ôn thi",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Thành tích học tập của bạn giữ vững phong độ ổn định.",
              "statModifiers": {
                "intelligence": 8,
                "stress": -6
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p1_21_yearbook_memories",
      "category": "relationship",
      "title": "Lưu Bút Áo Trắng & Ảnh Kỷ Yếu Cuối Cấp",
      "minAge": 17,
      "maxAge": 18,
      "priority": 78,
      "isOneTime": true,
      "description": "Ve kêu râm ran trên tán phượng đỏ. Cả lớp chuyền tay nhau ký tên lên chiếc áo trắng đồng phục ngày chia tay.",
      "conditions": [],
      "options": [
        {
          "id": "opt_write_heartfelt",
          "label": "Chụp thật nhiều ảnh kỷ niệm và hứa hẹn 10 năm sau gặp lại ở đỉnh cao",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Những dòng chữ nguệch ngoạc mà chân thành sẽ theo bạn suốt cả cuộc đời.",
              "statModifiers": {
                "happiness": 15,
                "charisma": 8,
                "karma": 5
              }
            }
          ]
        },
        {
          "id": "opt_edit_class_video",
          "label": "Tự tay dựng một bộ phim ngắn lưu giữ thanh xuân tặng cả lớp",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Cả lớp vỡ òa xúc động khi xem video! Nhiều người đặt hàng bạn dựng clip kỷ yếu thuê.",
              "statModifiers": {
                "practicalSkills": 12,
                "happiness": 14,
                "cash": 500000
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p1_24_motorbike_license_a1",
      "category": "education",
      "title": "Thử Thách Vòng Số 8 Thi Bằng Lái A1",
      "minAge": 18,
      "maxAge": 19,
      "priority": 76,
      "isOneTime": true,
      "description": "Đủ 18 tuổi hợp pháp cầm lái! Sau phần thi lý thuyết, bạn bước vào sa hình 'vòng số 8 huyền thoại' dưới ánh mắt giám khảo.",
      "conditions": [],
      "options": [
        {
          "id": "opt_practice_figure8",
          "label": "Tập dượt kỹ giữ ga đều ở số 3 và vào cua mượt mà",
          "outcomes": [
            {
              "probability": 0.85,
              "message": "Đạt điểm tuyệt đối 100/100! Tấm bằng lái đầu tiên đánh dấu sự trưởng thành tự do!",
              "statModifiers": {
                "practicalSkills": 10,
                "happiness": 12,
                "discipline": 5
              }
            },
            {
              "probability": 0.15,
              "message": "Chạm vạch nhẹ ở khúc cua cuối, nhưng lần thi lại sau đó bạn vượt qua dễ dàng!",
              "statModifiers": {
                "practicalSkills": 6,
                "stress": 5
              }
            }
          ]
        },
        {
          "id": "opt_deep_breath_focus",
          "label": "Hít sâu giữ bình tĩnh tuyệt đối, không nhìn xuống bánh xe",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Bạn lướt qua vòng số 8 êm ru trong tiếng vỗ tay của thí sinh chờ thi!",
              "statModifiers": {
                "practicalSkills": 8,
                "discipline": 8,
                "happiness": 10
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p1_25_north_south_train",
      "category": "culture",
      "title": "Chuyến Tàu Thống Nhất Xuyên Việt",
      "minAge": 16,
      "maxAge": 24,
      "priority": 62,
      "isOneTime": true,
      "description": "Ngồi bên cửa sổ toa tàu lướt qua đèo Hải Vân hùng vĩ, một bên là núi xanh ngắt, một bên là biển cả bao la.",
      "conditions": [],
      "options": [
        {
          "id": "opt_meet_travelers",
          "label": "Trò chuyện cùng các hành khách bốn phương trên toa tàu",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Mỗi câu chuyện từ những vùng đất khác nhau mở rộng tầm nhìn và vốn sống của bạn.",
              "statModifiers": {
                "charisma": 10,
                "intelligence": 6,
                "happiness": 12
              }
            }
          ]
        },
        {
          "id": "opt_journal_goals",
          "label": "Viết danh sách mục tiêu chinh phục 1 Tỷ USD trong cuốn sổ tay hành trình",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Khát vọng lớn hình thành rõ nét giữa non sông gấm vóc tươi đẹp!",
              "statModifiers": {
                "discipline": 10,
                "businessAcuity": 8,
                "happiness": 10
              }
            }
          ]
        }
      ]
    }
  ],
  "randomEvents": [
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
      "eventId": "p2_12_new_years_eve_deadline",
      "category": "career",
      "title": "Trực Xử Lý Hệ Thống Đêm Giao Thừa",
      "minAge": 23,
      "maxAge": 45,
      "priority": 54,
      "isOneTime": false,
      "description": "Ngoài phố pháo hoa chuẩn bị bắn rực trời, nhưng hệ thống thanh toán / vận hành bất ngờ báo động đỏ đúng 23 giờ 15 phút!",
      "conditions": [],
      "options": [
        {
          "id": "opt_fix_bug_hero",
          "label": "Bật laptop xử lý sự cố dứt điểm trước thời khắc đếm ngược",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Hệ thống thông suốt trở lại đúng 23:55! Sếp thưởng nóng đậm tay cho tinh thần trách nhiệm!",
              "statModifiers": {
                "cash": 18000000,
                "practicalSkills": 10,
                "discipline": 8,
                "stress": 10
              }
            }
          ]
        },
        {
          "id": "opt_delegate_backup",
          "label": "Kích hoạt hệ thống dự phòng tự động theo quy trình đã chuẩn bị",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Chuyển đổi mượt mà chỉ trong 2 phút để bạn kịp ra ban công ngắm pháo hoa cùng gia đình!",
              "statModifiers": {
                "intelligence": 8,
                "happiness": 12
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p2_15_office_back_pain",
      "category": "career",
      "title": "Căn Bệnh Văn Phòng: Đau Lưng & Mắt Mờ",
      "minAge": 27,
      "maxAge": 52,
      "priority": 56,
      "isOneTime": false,
      "description": "Ngồi nhìn màn hình 11 tiếng mỗi ngày bắt đầu khiến cổ vai gáy của bạn cứng đơ và dạ dày biểu tình.",
      "conditions": [],
      "options": [
        {
          "id": "opt_ergonomic_setup",
          "label": "Đầu tư ghế công thái học 8 triệu và tập giãn cơ mỗi 60 phút",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Cột sống được giải phóng, năng suất làm việc và giấc ngủ cải thiện rõ rệt!",
              "statModifiers": {
                "cash": -8000000,
                "health": 12,
                "stress": -10
              }
            }
          ]
        },
        {
          "id": "opt_free_stretch_routine",
          "label": "Tự đặt báo thức đi bộ leo cầu thang bộ và uống đủ 2 lít nước mỗi ngày",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Thói quen tốt không tốn một xu giúp cơ thể dẻo dai trở lại!",
              "statModifiers": {
                "health": 8,
                "discipline": 8,
                "stress": -6
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p2_16_corporate_marathon",
      "category": "culture",
      "title": "Giải Chạy Bộ Thiện Nguyện Doanh Nghiệp",
      "minAge": 22,
      "maxAge": 55,
      "priority": 50,
      "isOneTime": false,
      "description": "Cuối tuần công ty và đối tác tổ chức giải chạy bộ quanh Hồ Gươm / Thủ Thiêm, mỗi km hoàn thành sẽ quyên góp tiền trồng rừng.",
      "conditions": [],
      "options": [
        {
          "id": "opt_run_21km",
          "label": "Đăng ký cự ly 21km bứt phá giới hạn bản thân",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Về đích dưới nắng sớm trong tiếng reo hò! Ý chí và thể lực tăng vượt bậc!",
              "statModifiers": {
                "health": 12,
                "discipline": 10,
                "karma": 8,
                "happiness": 12
              }
            }
          ]
        },
        {
          "id": "opt_run_5km_connect",
          "label": "Chạy nhẹ nhàng 5km trò chuyện cùng lãnh đạo và đối tác mới",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Không khí thể thao cởi mở giúp bạn kết thân với nhiều nhân vật quan trọng!",
              "statModifiers": {
                "health": 6,
                "charisma": 10,
                "socialStatus": 8
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p2_23_tax_safety_inspection",
      "category": "finance",
      "title": "Đoàn Kiểm Tra Thuế & PCCC Định Kỳ",
      "minAge": 26,
      "maxAge": 62,
      "priority": 58,
      "isOneTime": false,
      "description": "Đoàn liên ngành đến kiểm tra định kỳ hệ thống hóa đơn chứng từ và trang thiết bị phòng cháy chữa cháy tại cơ sở.",
      "conditions": [],
      "options": [
        {
          "id": "opt_full_compliance",
          "label": "Xuất trình hồ sơ hóa đơn chuẩn chỉnh và trang bị PCCC đầy đủ từ đầu",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Đoàn kiểm tra đánh giá đạt chuẩn tuyệt đối 10/10, hoạt động kinh doanh vững vàng!",
              "statModifiers": {
                "discipline": 10,
                "socialStatus": 8,
                "stress": -6
              }
            }
          ]
        },
        {
          "id": "opt_quick_upgrade_gear",
          "label": "Bổ sung thêm bình chữa cháy và hoàn thiện sổ sách kế toán chuẩn mực",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Mọi quy chuẩn an toàn được nâng lên mức cao nhất cho nhân viên và khách hàng.",
              "statModifiers": {
                "practicalSkills": 8,
                "karma": 6
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p4_02_rush_hour_flood_jam",
      "category": "culture",
      "title": "Kẹt Xe 2 Tiếng Dưới Cơn Mưa Ngập Tan Tầm",
      "minAge": 20,
      "maxAge": 55,
      "priority": 48,
      "isOneTime": false,
      "description": "5 giờ rưỡi chiều mưa trút nước, cả con phố biến thành sông với hàng dài xe cộ nhích từng centimet.",
      "conditions": [],
      "options": [
        {
          "id": "opt_podcast_relax",
          "label": "Tạt vào quán cà phê đọc sách nghe podcast tài chính chờ đường thông thoáng",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Không bực dọc kẹt xe mà còn học thêm được nhiều kiến thức đầu tư mới!",
              "statModifiers": {
                "financialLiteracy": 6,
                "intelligence": 4,
                "stress": -6
              }
            }
          ]
        },
        {
          "id": "opt_help_stalled_bike",
          "label": "Phụ đẩy giúp chiếc xe chết máy của người đi đường lên vỉa hè khô ráo",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Hành động đẹp giữa cơn mưa khiến người xa lạ cảm ơn rối rít.",
              "statModifiers": {
                "karma": 12,
                "happiness": 10,
                "health": 2
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p4_12_highland_scholarship",
      "category": "culture",
      "title": "Chương Trình 'Cơm Có Thịt' Cho Trẻ Em Vùng Cao",
      "minAge": 28,
      "maxAge": 82,
      "priority": 66,
      "isOneTime": false,
      "description": "Hình ảnh những em nhỏ vùng núi cao đi bộ hàng cây số tới điểm trường giữa sương mù giá rét chạm tới trái tim bạn.",
      "conditions": [
        {
          "field": "cash",
          "operatorType": ">=",
          "numberValue": 30000000
        }
      ],
      "options": [
        {
          "id": "opt_sponsor_25m",
          "label": "Tài trợ 25 triệu đồng xây bếp ăn bán trú và tặng áo ấm mùa đông",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Nụ cười rạng rỡ của các em nhỏ vùng cao lan tỏa nguồn năng lượng thiện lành sâu sắc!",
              "statModifiers": {
                "cash": -25000000,
                "karma": 26,
                "happiness": 22,
                "socialStatus": 14,
                "stress": -10
              }
            }
          ]
        },
        {
          "id": "opt_donate_books_5m",
          "label": "Gửi tặng 5 triệu đồng cùng hàng trăm cuốn sách truyện thiếu nhi",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Thư viện nhỏ nơi bản xa sáng đèn tri thức cho bao em thơ!",
              "statModifiers": {
                "cash": -5000000,
                "karma": 14,
                "happiness": 12
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p4_13_noisy_construction_next",
      "category": "culture",
      "title": "Hàng Xóm Xây Nhà Mới Khoan Cắt Suốt Nửa Năm",
      "minAge": 25,
      "maxAge": 75,
      "priority": 44,
      "isOneTime": false,
      "description": "Từ 7 giờ sáng mỗi ngày tiếng máy khoan bê tông đinh tai nhức óc vang lên ngay sát vách tường nhà bạn.",
      "conditions": [],
      "options": [
        {
          "id": "opt_coworking_escape",
          "label": "Chuyển sang làm việc tại quán cà phê yên tĩnh / co-working space đầy cảm hứng",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Không gian mới mẻ giúp bạn tập trung cao độ và tình cờ gặp gỡ đối tác hay!",
              "statModifiers": {
                "charisma": 6,
                "businessAcuity": 5,
                "stress": -5
              }
            }
          ]
        },
        {
          "id": "opt_agree_quiet_noon",
          "label": "Trao đổi thiện chí với chủ nhà thống nhất nghỉ trưa 12h–13h30 không khoan đục",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Chủ nhà vui vẻ tiếp thu và biếu gia đình bạn giỏ trái cây cảm ơn sự thông cảm!",
              "statModifiers": {
                "charisma": 8,
                "karma": 5,
                "stress": -8
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p4_15_annual_health_screening",
      "category": "childhood",
      "title": "Khám Sức Khỏe Tổng Quát Định Kỳ",
      "minAge": 35,
      "maxAge": 80,
      "priority": 66,
      "isOneTime": false,
      "description": "Bác sĩ xem kết quả xét nghiệm máu và siêu âm định kỳ của bạn trong buổi kiểm tra sức khỏe hàng năm.",
      "conditions": [],
      "options": [
        {
          "id": "opt_strict_diet_sleep",
          "label": "Tuân thủ thực đơn ít dầu mỡ, tập cardio đều đặn và ngủ trước 23h",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Các chỉ số sinh học đẹp như tuổi đôi mươi! Sức khỏe dẻo dai bền bỉ!",
              "statModifiers": {
                "health": 12,
                "discipline": 8,
                "stress": -8,
                "appearance": 5
              }
            }
          ]
        },
        {
          "id": "opt_yoga_swimming",
          "label": "Duy trì bơi lội và yoga mỗi tuần 3 buổi giải tỏa căng thẳng",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Xương khớp linh hoạt, tinh thần minh mẫn sảng khoái!",
              "statModifiers": {
                "health": 10,
                "happiness": 10,
                "stress": -12
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p4_20_childhood_friend_tea",
      "category": "relationship",
      "title": "Bạn Tri Kỷ Thời Thơ Ấu Ghé Thăm",
      "minAge": 62,
      "maxAge": 88,
      "priority": 62,
      "isOneTime": false,
      "description": "Người bạn nối khố từ thuở cởi truồng tắm mưa bỗng ghé thăm nhà cùng gói trà sen và bao chuyện ngày xưa.",
      "conditions": [],
      "options": [
        {
          "id": "opt_tea_reminisce",
          "label": "Pha ấm trà ngon ngồi ôn lại cả trời ký ức thanh xuân tươi đẹp",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Tiếng cười giòn tan ở tuổi xế chiều sưởi ấm cả gian phòng!",
              "statModifiers": {
                "happiness": 18,
                "stress": -15,
                "health": 5
              }
            }
          ]
        },
        {
          "id": "opt_chess_match",
          "label": "Bày bàn cờ tướng đấu 3 ván phân tài cao thấp",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Những nước cờ hóc búa giúp trí óc luôn sắc sảo tinh anh!",
              "statModifiers": {
                "intelligence": 6,
                "happiness": 14
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p4_24_golden_years_sharp_mind",
      "category": "childhood",
      "title": "Bí Quyết Minh Mẫn Tuổi Xế Chiều",
      "minAge": 72,
      "maxAge": 95,
      "priority": 60,
      "isOneTime": false,
      "description": "Mỗi sáng thức dậy khi sương mai còn đọng trên lá, bạn duy trì thói quen rèn luyện trí não và thể chất nhẹ nhàng.",
      "conditions": [],
      "options": [
        {
          "id": "opt_read_news_chess",
          "label": "Đọc báo kinh tế, làm thơ và giải ô chữ giữ đầu óc tinh anh",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Trí nhớ minh mẫn sắc bén khiến bác sĩ cũng phải ngạc nhiên khâm phục!",
              "statModifiers": {
                "intelligence": 6,
                "health": 5,
                "happiness": 10
              }
            }
          ]
        },
        {
          "id": "opt_garden_walk",
          "label": "Tưới cây cảnh và đi bộ nhẹ nhàng tắm nắng sớm 30 phút",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Xương khớp dẻo dai, giấc ngủ sâu và tinh thần luôn lạc quan yêu đời!",
              "statModifiers": {
                "health": 8,
                "stress": -10,
                "happiness": 12
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p3_02_vietlott_rainy_day",
      "category": "culture",
      "title": "Mua Tờ Vé Số Trú Mưa Chiều Cuối Tuần",
      "minAge": 18,
      "maxAge": 75,
      "priority": 48,
      "isOneTime": false,
      "description": "Cơn mưa rào bất chợt khiến bạn tạt vào mái hiên đại lý vé số điện toán. Tấm biển Jackpot đang nhấp nháy con số hàng chục tỷ.",
      "conditions": [],
      "options": [
        {
          "id": "opt_buy_one_ticket",
          "label": "Thử vận may đúng 1 tờ chọn bộ số ngày sinh (10.000 đ)",
          "outcomes": [
            {
              "probability": 0.12,
              "conditionFormula": "luck >= 60",
              "message": "TRÚNG GIẢI NHÌ! Tiếng chuông báo tin bạn vừa trúng thưởng 10 triệu đồng!",
              "statModifiers": {
                "cash": 10000000,
                "happiness": 22
              }
            },
            {
              "probability": 0.88,
              "message": "Chúc bạn may mắn lần sau! Niềm vui nhỏ chờ đợi giờ quay số cuối tuần.",
              "statModifiers": {
                "happiness": 3
              }
            }
          ]
        },
        {
          "id": "opt_help_vendor_tea",
          "label": "Mời bác bán vé số dạo ly trà nóng cho ấm người giữa cơn mưa",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Nụ cười rạng rỡ của bác khiến cả chiều mưa trở nên ấm áp lạ thường.",
              "statModifiers": {
                "karma": 10,
                "happiness": 8
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p3_05_gold_rush_queue",
      "category": "finance",
      "title": "Xếp Hàng Từ 5 Giờ Sáng Mua Vàng Lập Đỉnh",
      "minAge": 22,
      "maxAge": 70,
      "priority": 60,
      "isOneTime": false,
      "description": "Giá vàng SJC và vàng nhẫn 9999 liên tiếp phá kỷ lục mới. Phố vàng đông nghịt người chen chân mua vào.",
      "conditions": [
        {
          "field": "cash",
          "operatorType": ">=",
          "numberValue": 50000000
        }
      ],
      "options": [
        {
          "id": "opt_rebalance_contrarian",
          "label": "Không chạy theo đám đông lúc đỉnh — chốt lời nhẹ hoặc giữ tiền chờ nhịp điều chỉnh",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Hai tuần sau chênh lệch mua-bán co hẹp, bạn mua vào được mức giá tốt hơn hẳn!",
              "statModifiers": {
                "cash": 18000000,
                "financialLiteracy": 12,
                "discipline": 8
              }
            }
          ]
        },
        {
          "id": "opt_dollar_cost_average",
          "label": "Chia nhỏ vốn tích lũy đều đặn từng chỉ mỗi quý làm quỹ dự phòng",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Chiến lược tích sản đều đặn giúp tài sản chống trượt giá bền vững.",
              "statModifiers": {
                "cash": 12000000,
                "financialLiteracy": 8,
                "stress": -5
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p3_11_bluechip_dividend_wave",
      "category": "finance",
      "title": "Sóng Cổ Phiếu Ngân Hàng & Khu Công Nghiệp",
      "minAge": 24,
      "maxAge": 70,
      "priority": 64,
      "isOneTime": false,
      "description": "Dòng vốn ngoại đổ mạnh vào thị trường chứng khoán Việt Nam đón sóng nâng hạng thị trường mới nổi.",
      "conditions": [
        {
          "field": "cash",
          "operatorType": ">=",
          "numberValue": 100000000
        }
      ],
      "options": [
        {
          "id": "opt_invest_fundamental",
          "label": "Giải ngân 100 triệu vào nhóm cổ phiếu đầu ngành lợi nhuận tăng trưởng đều",
          "outcomes": [
            {
              "probability": 0.8,
              "conditionFormula": "financialLiteracy >= 35",
              "message": "Chốt lời đúng nhịp tăng trưởng! Tài khoản chứng khoán sinh lời +65 triệu!",
              "statModifiers": {
                "cash": 65000000,
                "financialLiteracy": 10,
                "happiness": 12
              }
            },
            {
              "probability": 0.2,
              "message": "Thị trường rung lắc ngắn hạn nhưng cổ tức tiền mặt bù lại giữ danh mục hòa vốn.",
              "statModifiers": {
                "cash": 8000000,
                "financialLiteracy": 6
              }
            }
          ]
        },
        {
          "id": "opt_etf_index_safe",
          "label": "Mua chứng chỉ quỹ ETF VN30 nắm giữ dài hạn không tốn công lướt sóng",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Danh mục tăng trưởng ổn định 16% nhẹ đầu nhàn thân!",
              "statModifiers": {
                "cash": 16000000,
                "stress": -6,
                "financialLiteracy": 8
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p3_16_fake_police_scam_call",
      "category": "culture",
      "title": "Cuộc Gọi Lạ Giả Danh Cán Bộ Điều Tra",
      "minAge": 22,
      "maxAge": 78,
      "priority": 65,
      "isOneTime": false,
      "description": "Số điện thoại lạ dọa tài khoản ngân hàng của bạn dính đường dây rửa tiền và yêu cầu cài app 'Cổng dịch vụ công giả mạo' để xác minh.",
      "conditions": [],
      "options": [
        {
          "id": "opt_hangup_block",
          "label": "Cúp máy cái rụp, chặn số và tuyên truyền cho bố mẹ người thân cảnh giác",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Bảo toàn 100% tài sản ngân hàng! Bố mẹ cũng học được chiêu nhận diện lừa đảo công nghệ cao.",
              "statModifiers": {
                "financialLiteracy": 10,
                "karma": 10,
                "parentRelationship": 8
              }
            }
          ]
        },
        {
          "id": "opt_report_hotline",
          "label": "Ghi âm báo cáo số điện thoại lừa đảo tới tổng đài cơ quan chức năng",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Góp phần khóa thuê bao lừa đảo bảo vệ hàng trăm người dân khác!",
              "statModifiers": {
                "karma": 15,
                "socialStatus": 8,
                "intelligence": 4
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p3_23_record_dividend_payout",
      "category": "finance",
      "title": "Cổ Tức Tiền Mặt Kỷ Lục Về Tài Khoản",
      "minAge": 26,
      "maxAge": 80,
      "priority": 68,
      "isOneTime": false,
      "description": "Các khoản đầu tư cổ phần và doanh nghiệp làm ăn phát đạt đồng loạt thông báo chia cổ tức tiền mặt tỷ lệ cao kỷ lục!",
      "conditions": [
        {
          "field": "cash",
          "operatorType": ">=",
          "numberValue": 100000000
        }
      ],
      "options": [
        {
          "id": "opt_reinvest_compound",
          "label": "Tái đầu tư toàn bộ cổ tức tận dụng kỳ quan lãi kép",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Khối tài sản sinh lời theo cấp số nhân không ngừng nghỉ!",
              "statModifiers": {
                "cash": 145000000,
                "financialLiteracy": 10,
                "happiness": 14
              }
            }
          ]
        },
        {
          "id": "opt_reward_family_trip",
          "label": "Trích một phần nhỏ đưa cả nhà đi nghỉ dưỡng, phần lớn giữ tái đầu tư",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Vừa gia tăng tài sản vừa tận hưởng thành quả bên những người thân yêu!",
              "statModifiers": {
                "cash": 110000000,
                "happiness": 18,
                "parentRelationship": 10,
                "stress": -12
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p1_05_lost_fountain_pen",
      "category": "education",
      "title": "Chiếc Bút Mực Tím Bị Thất Lạc",
      "minAge": 6,
      "maxAge": 9,
      "priority": 60,
      "isOneTime": false,
      "description": "Giờ viết chính tả buổi chiều, bạn lục tung cả cặp sách mà không thấy chiếc bút mực mới tinh đâu.",
      "conditions": [],
      "options": [
        {
          "id": "opt_borrow_calmly",
          "label": "Bình tĩnh hỏi mượn tạm bạn cùng bàn và rà lại ngăn bàn sau giờ học",
          "outcomes": [
            {
              "probability": 0.75,
              "message": "Bạn tìm thấy bút rơi dưới gầm bàn cuối lớp và rèn tính cẩn thận giữ đồ!",
              "statModifiers": {
                "discipline": 6,
                "charisma": 4
              }
            },
            {
              "probability": 0.25,
              "message": "Dù không tìm lại được bút cũ nhưng bạn học cách sắp xếp cặp gọn gàng hơn.",
              "statModifiers": {
                "discipline": 4,
                "stress": 4
              }
            }
          ]
        },
        {
          "id": "opt_report_teacher",
          "label": "Thưa cô giáo chủ nhiệm để cùng cả lớp kiểm tra lại",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Bạn ngồi cạnh trả lại do nhầm hộp bút giống hệt nhau.",
              "statModifiers": {
                "happiness": 6,
                "discipline": 4
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p1_07_parent_teacher_meeting",
      "category": "education",
      "title": "Ngày Họp Phụ Huynh Cuối Học Kỳ",
      "minAge": 7,
      "maxAge": 14,
      "priority": 66,
      "isOneTime": false,
      "description": "Sáng Chủ nhật, bố mẹ mặc áo sơ mi chỉnh tề lên lớp nghe cô chủ nhiệm nhận xét về học lực và hạnh kiểm của bạn.",
      "conditions": [],
      "options": [
        {
          "id": "opt_show_notebook",
          "label": "Chủ động đưa trước bài kiểm tra và thành thật nhận lỗi nếu có điểm kém",
          "outcomes": [
            {
              "probability": 0.75,
              "conditionFormula": "intelligence >= 55",
              "message": "Cô giáo khen bạn tiến bộ vượt bậc trước cả lớp! Mẹ thưởng cho một bữa gà rán no nê.",
              "statModifiers": {
                "happiness": 12,
                "parentRelationship": 10,
                "socialStatus": 5
              }
            },
            {
              "probability": 0.25,
              "message": "Tuy điểm Toán chưa cao nhưng bố mẹ đánh giá cao sự trung thực của bạn.",
              "statModifiers": {
                "karma": 6,
                "discipline": 6,
                "parentRelationship": 4
              }
            }
          ]
        },
        {
          "id": "opt_clean_house_before",
          "label": "Dọn nhà sạch bong, rửa sẵn ấm chén trước khi bố mẹ đi họp về",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Chiến thuật 'lấy công chuộc tội' thành công mỹ mãn!",
              "statModifiers": {
                "practicalSkills": 6,
                "charisma": 6,
                "parentRelationship": 8
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p1_09_snack_card_craze",
      "category": "culture",
      "title": "Cơn Sốt Sưu Tầm Thẻ Bài Bim Bim",
      "minAge": 7,
      "maxAge": 11,
      "priority": 55,
      "isOneTime": false,
      "description": "Cả trường đang phát cuồng sưu tầm thẻ bài hiếm kẹp trong gói snack cổng trường. Bạn vừa bóc trúng thẻ SSR cực hiếm!",
      "conditions": [],
      "options": [
        {
          "id": "opt_trade_smart",
          "label": "Trao đổi khéo léo lấy 5 thẻ thường cho bạn cùng bàn kiếm lời",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Thương vụ kinh doanh đầu đời cho thấy tố chất đàm phán bẩm sinh của bạn!",
              "statModifiers": {
                "businessAcuity": 8,
                "financialLiteracy": 5,
                "charisma": 5
              }
            }
          ]
        },
        {
          "id": "opt_keep_collection",
          "label": "Cất cẩn thận vào hộp sắt làm báu vật kỷ niệm",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Niềm vui giản dị mỗi giờ ra chơi ngắm bộ sưu tập cùng bạn bè.",
              "statModifiers": {
                "happiness": 10,
                "stress": -5
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p1_10_teacher_day_show",
      "category": "culture",
      "title": "Hội Diễn Văn Nghệ Chào Mừng 20/11",
      "minAge": 8,
      "maxAge": 16,
      "priority": 62,
      "isOneTime": false,
      "description": "Lớp đang tuyển thành viên cho tiết mục múa hát và đóng kịch tri ân thầy cô ngày Nhà giáo Việt Nam 20/11.",
      "conditions": [],
      "options": [
        {
          "id": "opt_lead_mc",
          "label": "Xung phong làm MC dẫn chương trình cho tiết mục của lớp",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Giọng nói truyền cảm và sự tự tin giúp lớp bạn giành giải Nhất toàn trường!",
              "statModifiers": {
                "charisma": 12,
                "socialStatus": 8,
                "happiness": 10
              }
            }
          ]
        },
        {
          "id": "opt_stage_props",
          "label": "Phụ trách thiết kế đạo cụ, phông nền và âm thanh hậu cần",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Sự tỉ mỉ hậu trường giúp tiết mục diễn ra trơn tru không một lỗi nhỏ.",
              "statModifiers": {
                "practicalSkills": 10,
                "discipline": 6
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p1_11_summer_blackout",
      "category": "culture",
      "title": "Đêm Mất Điện Hóng Mát Cả Xóm",
      "minAge": 6,
      "maxAge": 14,
      "priority": 52,
      "isOneTime": false,
      "description": "9 giờ tối cả khu phố bỗng tối om vì quá tải điện mùa hè. Mọi người đồng loạt mang chiếu ra đầu ngõ phe phẩy quạt mo.",
      "conditions": [],
      "options": [
        {
          "id": "opt_stargaze_stories",
          "label": "Nằm trên chiếu ngắm bầu trời đầy sao và nghe chuyện cổ tích",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Không có Wi-Fi nhưng tình làng nghĩa xóm đêm hè ấm áp lạ thường.",
              "statModifiers": {
                "happiness": 10,
                "stress": -10,
                "parentRelationship": 6
              }
            }
          ]
        },
        {
          "id": "opt_count_stars_puzzle",
          "label": "Thi giải câu đố dân gian cùng các anh chị hàng xóm",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Bạn trả lời vanh vách khiến ai cũng khen nhanh trí!",
              "statModifiers": {
                "intelligence": 7,
                "charisma": 6
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p1_15_pink_eye_wave",
      "category": "childhood",
      "title": "Đợt Dịch Đau Mắt Đỏ Ở Lớp",
      "minAge": 10,
      "maxAge": 15,
      "priority": 45,
      "isOneTime": false,
      "description": "Nửa lớp đeo kính râm đi học vì dịch đau mắt đỏ lây lan nhanh trong mùa nồm ẩm.",
      "conditions": [],
      "options": [
        {
          "id": "opt_hygiene_care",
          "label": "Rửa tay xà phòng thường xuyên và nhỏ nước muối sinh lý phòng ngừa",
          "outcomes": [
            {
              "probability": 0.85,
              "message": "Bạn miễn nhiễm hoàn toàn trong suốt mùa dịch và giữ trọn điểm chuyên cần!",
              "statModifiers": {
                "health": 5,
                "discipline": 6
              }
            },
            {
              "probability": 0.15,
              "message": "Vẫn hơi đỏ mắt nhẹ nhưng khỏi rất nhanh chỉ sau 3 ngày.",
              "statModifiers": {
                "health": -3
              }
            }
          ]
        },
        {
          "id": "opt_wear_cool_shades",
          "label": "Đeo kính râm đen ngầu lòi lên lớp dù chưa bị lây để phòng bụi",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Cả lớp bật cười trước phong cách siêu ngầu nhưng rất hiệu quả!",
              "statModifiers": {
                "appearance": 4,
                "happiness": 6
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p1_18_class_sports_cup",
      "category": "childhood",
      "title": "Giải Bóng Đá / Cầu Lông Liên Lớp",
      "minAge": 12,
      "maxAge": 17,
      "priority": 58,
      "isOneTime": false,
      "description": "Trận chung kết giải thể thao toàn trường diễn ra giữa tiếng hò reo cổ vũ vang trời của hai khối lớp.",
      "conditions": [],
      "options": [
        {
          "id": "opt_play_final",
          "label": "Ra sân thi đấu hết mình đến phút bù giờ cuối cùng",
          "outcomes": [
            {
              "probability": 0.65,
              "conditionFormula": "health >= 65",
              "message": "BÀN THẮNG VÀNG! Cả lớp ùa xuống sân công kênh bạn ăn mừng chức vô địch!",
              "statModifiers": {
                "health": 8,
                "happiness": 16,
                "socialStatus": 10,
                "appearance": 4
              }
            },
            {
              "probability": 0.35,
              "message": "Dù thua sát nút trên chấm luân lưu nhưng tinh thần fair-play được cả trường vỗ tay.",
              "statModifiers": {
                "health": 6,
                "discipline": 6,
                "happiness": 6
              }
            }
          ]
        },
        {
          "id": "opt_organize_cheer",
          "label": "Phát nước mát và làm nhạc trưởng khuấy động khán đài cổ vũ",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Đội bạn đá sung hẳn lên nhờ dàn cổ động viên nhiệt huyết nhất trường!",
              "statModifiers": {
                "charisma": 10,
                "happiness": 10
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p1_22_banh_chung_eve",
      "category": "culture",
      "title": "Thức Canh Nồi Bánh Chưng Đêm 30 Tết",
      "minAge": 12,
      "maxAge": 18,
      "priority": 60,
      "isOneTime": false,
      "description": "Khói bếp củi thơm lừng mùi lá dong nếp cái hoa vàng. Bố rủ bạn ngồi trông nồi bánh chưng và nướng khoai lang giữa đêm đông se lạnh.",
      "conditions": [],
      "options": [
        {
          "id": "opt_talk_with_dad",
          "label": "Ngồi tâm sự với bố về ước mơ sự nghiệp và tương lai",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Những lời khuyên mộc mạc mà sâu sắc của bố tiếp thêm cho bạn sức mạnh lớn lao.",
              "statModifiers": {
                "parentRelationship": 14,
                "discipline": 8,
                "happiness": 10
              }
            }
          ]
        },
        {
          "id": "opt_wrap_perfect_cake",
          "label": "Tự tay gói một chiếc bánh chưng vuông vức không cần khuôn",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Mẹ tấm tắc khen tay nghề khéo léo, dẻo thơm chuẩn vị cổ truyền!",
              "statModifiers": {
                "practicalSkills": 8,
                "karma": 6,
                "happiness": 8
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p1_23_football_storm_victory",
      "category": "culture",
      "title": "Đội Tuyển Việt Nam Vô Địch — Cả Nước Đi Bão!",
      "minAge": 14,
      "maxAge": 35,
      "priority": 66,
      "isOneTime": false,
      "description": "Tiếng còi mãn cuộc vang lên! Phố phường nhuộm đỏ màu cờ sao vàng trong tiếng hò reo vỡ òa niềm tự hào dân tộc.",
      "conditions": [],
      "options": [
        {
          "id": "opt_wave_flag_safely",
          "label": "Cầm cờ Tổ quốc hòa vào dòng người ăn mừng văn minh, an toàn",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Một đêm không ngủ ngập tràn cảm xúc tự hào kết nối triệu trái tim!",
              "statModifiers": {
                "happiness": 18,
                "stress": -15,
                "charisma": 6
              }
            }
          ]
        },
        {
          "id": "opt_sell_flags_horns",
          "label": "Nhanh nhạy nhập cờ áo và kèn cổ vũ bán dọc phố trung tâm",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Vừa hòa nhịp chiến thắng vừa bỏ túi khoản lãi bất ngờ ngay trong đêm!",
              "statModifiers": {
                "cash": 450000,
                "businessAcuity": 10,
                "happiness": 10
              }
            }
          ]
        }
      ]
    },
    {
      "eventId": "p1_26_holiday_flower_stall",
      "category": "finance",
      "title": "Bán Hoa Tươi Dịp Lễ 8/3 & 20/10",
      "minAge": 16,
      "maxAge": 21,
      "priority": 64,
      "isOneTime": false,
      "description": "Dịp lễ sắp tới, nhóm bạn rủ nhau dậy từ 4 giờ sáng ra chợ hoa đầu mối nhập hoa hồng về tự gói bán dọc vỉa hè.",
      "conditions": [],
      "options": [
        {
          "id": "opt_package_bouquets",
          "label": "Gói hoa nghệ thuật kèm thiệp viết tay bán giá hợp lý",
          "outcomes": [
            {
              "probability": 0.85,
              "message": "Khách mua tặng mẹ tặng người yêu khen nức nở! Chia lãi ròng thu về đầy túi!",
              "statModifiers": {
                "cash": 2500000,
                "businessAcuity": 10,
                "practicalSkills": 8,
                "charisma": 6
              }
            },
            {
              "probability": 0.15,
              "message": "Cuối ngày phải giảm giá xả hàng để thu hồi vốn, lãi nhẹ một bữa liên hoan.",
              "statModifiers": {
                "cash": 400000,
                "financialLiteracy": 6
              }
            }
          ]
        },
        {
          "id": "opt_be_delivery_rider",
          "label": "Nhận chân giao hoa hỏa tốc quanh nội thành hưởng hoa hồng từng đơn",
          "outcomes": [
            {
              "probability": 1.0,
              "message": "Không lo rủi ro tồn hàng, bạn nhận tiền công xứng đáng với công sức chạy suốt cả ngày.",
              "statModifiers": {
                "cash": 1500000,
                "discipline": 8,
                "health": 4
              }
            }
          ]
        }
      ]
    },
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
