document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    const det = document.getElementById('details');

    det.addEventListener('submit', (event) => {
      event.preventDefault();
      console.log('Form submit event triggered');
      const user = document.getElementById('name').value;
      const phn = document.getElementById('phn').value;
      const addr = document.getElementById('addr').value;
      const pin = document.getElementById('pin').value;

      if (!user) {
        alert('Name is required!');
        return;
      }
      if (!phn) {
        alert('Phone Number is required');
        return;
      }
      if (!addr) {
        alert('Address is required!');
        return;
      }
      if (!pin) {
        alert('Pincode is required');
        return;
      }

      const namepattn = /^[a-zA-Z\s]+$/;
      if (!namepattn.test(user)) {
        alert('Name should not contain Special Characters!');
        return;
      }

      const numpattn = /^[0-9]{10}$/;
      if (!numpattn.test(phn)) {
        alert('Phone number should contain 10 digits!');
        return;
      }

      fetch('http://localhost:5500/api/sav', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user, phn, addr, pin }),
        
      })
      .then(response => response.json())
      .then(data => {
      
        alert('Form submitted successfully!');
        popup.style.display = 'none';
      })
      .catch((error) => {
        alert('Error submitting form.');
      });
    
    });
});