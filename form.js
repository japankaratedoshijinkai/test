// フォームの日付制御
document.addEventListener('DOMContentLoaded', function() {
    const branchSelect = document.getElementById('branch');
    const experienceDate = document.getElementById('experienceDate');
    const dateHint = document.getElementById('dateHint');

    // 今日の日付を取得
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 最小日付を明日に設定
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    experienceDate.min = tomorrow.toISOString().split('T')[0];

    // 最大日付を3ヶ月後に設定
    const maxDate = new Date(today);
    maxDate.setMonth(maxDate.getMonth() + 3);
    experienceDate.max = maxDate.toISOString().split('T')[0];

    // 支部選択時の処理
    branchSelect.addEventListener('change', function() {
        const selectedBranch = this.value;
        experienceDate.value = ''; // 日付をリセット

        if (selectedBranch === 'chiba') {
            dateHint.textContent = '千葉支部は木曜日・土曜日のみ選択可能です（祝日は休み）';
            dateHint.style.color = '#e74c3c';
        } else if (selectedBranch === 'ichihara') {
            dateHint.textContent = '市原支部は水曜日・金曜日のみ選択可能です（祝日は休み）';
            dateHint.style.color = '#e74c3c';
        } else {
            dateHint.textContent = '支部を選択してください';
            dateHint.style.color = '#666';
        }
    });

    // 日付選択時のバリデーション
    experienceDate.addEventListener('change', function() {
        const selectedBranch = branchSelect.value;
        const selectedDate = new Date(this.value);
        selectedDate.setHours(0, 0, 0, 0);

        if (!selectedBranch) {
            alert('先に体験希望支部を選択してください');
            this.value = '';
            return;
        }

        // 過去の日付チェック
        if (selectedDate < today) {
            alert('過去の日付は選択できません');
            this.value = '';
            return;
        }

        const dayOfWeek = selectedDate.getDay(); // 0:日, 1:月, 2:火, 3:水, 4:木, 5:金, 6:土

        // 祝日チェック（簡易版 - 実際の祝日データは別途取得が望ましい）
        const isHoliday = checkIfHoliday(selectedDate);

        if (selectedBranch === 'chiba') {
            // 千葉支部：木曜日(4)と土曜日(6)のみ、祝日除く
            if (dayOfWeek !== 4 && dayOfWeek !== 6) {
                alert('千葉支部は木曜日・土曜日のみ体験可能です');
                this.value = '';
                return;
            }
            if (isHoliday) {
                alert('選択された日は祝日のため体験できません');
                this.value = '';
                return;
            }
        } else if (selectedBranch === 'ichihara') {
            // 市原支部：水曜日(3)と金曜日(5)のみ、祝日除く
            if (dayOfWeek !== 3 && dayOfWeek !== 5) {
                alert('市原支部は水曜日・金曜日のみ体験可能です');
                this.value = '';
                return;
            }
            if (isHoliday) {
                alert('選択された日は祝日のため体験できません');
                this.value = '';
                return;
            }
        }
    });

    // フォーム送信時の処理
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // フォームデータの収集
        const formData = {
            participantName: document.getElementById('participantName').value,
            age: document.getElementById('age').value,
            gender: document.getElementById('gender').value,
            guardianName: document.getElementById('guardianName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            branch: document.getElementById('branch').value,
            experienceDate: document.getElementById('experienceDate').value,
            message: document.getElementById('message').value
        };

        // ここで実際の送信処理を実装
        console.log('送信されたフォームデータ:', formData);
        alert('お問い合わせありがとうございます。\n内容を確認の上、ご連絡させていただきます。');

        // フォームをリセット
        this.reset();
        dateHint.textContent = '支部を選択してください';
        dateHint.style.color = '#666';
    });
});

// 簡易的な祝日チェック関数（2024-2025年の主要な祝日）
function checkIfHoliday(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 0-11 -> 1-12
    const day = date.getDate();

    const holidays = {
        2024: [
            '1-1', '1-8', '2-11', '2-12', '2-23', '3-20', '4-29',
            '5-3', '5-4', '5-5', '5-6', '7-15', '8-11', '8-12',
            '9-16', '9-22', '9-23', '10-14', '11-3', '11-4', '11-23'
        ],
        2025: [
            '1-1', '1-13', '2-11', '2-23', '2-24', '3-20', '4-29',
            '5-3', '5-4', '5-5', '5-6', '7-21', '8-11', '9-15',
            '9-22', '9-23', '10-13', '11-3', '11-23', '11-24'
        ],
        2026: [
            '1-1', '1-12', '2-11', '2-23', '3-20', '4-29', '5-3',
            '5-4', '5-5', '5-6', '7-20', '8-11', '9-21', '9-22',
            '9-23', '10-12', '11-3', '11-23'
        ]
    };

    const dateString = `${month}-${day}`;
    return holidays[year] && holidays[year].includes(dateString);
}
