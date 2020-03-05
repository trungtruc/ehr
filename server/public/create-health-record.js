console.log('This script really work')

let buttonPlus = document.querySelectorAll('.buttonPlus');



buttonPlus.forEach(button => {
    button.addEventListener('click', (event) =>{
        const cloneInputGroup = event.target.parentNode.querySelector('.text-input').cloneNode(true);
        const rootElement = event.target.parentNode.parentNode
        rootElement.appendChild(cloneInputGroup)
        console.log(rootElement)
    })
});

const buttonAddMedicine = document.getElementById('button-add-medicine');
const medicationSection = document.querySelector('.medication-section');
const medicationSectionWrapper = document.querySelector('.medication-section-wrapper');
console.log(medicationSectionWrapper.childNodes);

buttonAddMedicine.addEventListener('click', () => {
    const cloneMedicationSection = medicationSection.cloneNode(true);
    medicationSectionWrapper.insertBefore(cloneMedicationSection,buttonAddMedicine);
})