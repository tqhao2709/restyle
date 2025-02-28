document.addEventListener('DOMContentLoaded', async () => {
    const provinceSelect = document.getElementById('province');
    const districtSelect = document.getElementById('district');

    let provinces = {};
    let districts = {};

    // Function to fetch JSON data
    async function fetchData() {
        try {
            // Fetch province data
            const responseProvinces = await fetch('js/tinh_tp.json');
            provinces = await responseProvinces.json();

            // Fetch district data
            const responseDistricts = await fetch('js/quan_huyen.json');
            districts = await responseDistricts.json();

            // Populate province dropdown
            populateProvinces();

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // Function to populate provinces dropdown
    function populateProvinces() {
        provinceSelect.innerHTML = '<option value="">--Select--</option>';
        Object.values(provinces).forEach(province => {
            const option = document.createElement('option');
            option.value = province.code;
            option.textContent = province.name_with_type;
            provinceSelect.appendChild(option);
        });

        // Initialize districts for the first province
        const firstProvinceCode = Object.keys(provinces)[0];
        populateDistricts(firstProvinceCode);
    }

    // Function to populate districts dropdown based on selected province
    function populateDistricts(selectedProvinceCode) {
        districtSelect.innerHTML = '<option value="">--Select--</option>';
        Object.values(districts).forEach(district => {
            if (district.parent_code === selectedProvinceCode) {
                const option = document.createElement('option');
                option.value = district.code;
                option.textContent = district.name_with_type;
                districtSelect.appendChild(option);
            }
        });
    }

    // Event listener for province select change
    provinceSelect.addEventListener('change', () => {
        const selectedProvinceCode = provinceSelect.value;
        populateDistricts(selectedProvinceCode);
    });

    // Fetch data on page load
    fetchData();
});
