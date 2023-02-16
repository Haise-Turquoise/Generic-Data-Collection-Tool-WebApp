import Swal from 'sweetalert2';

export const unauthorized_dialog = () => {
  Swal.fire({
    title: 'It seems like you do not have access to this action...',
    text: 'Please contact the administrator for access',
    icon: 'warning',
    confirmButtonText: 'Back',
    allowOutsideClick: false,
  }).then(result => {
    if (result.isConfirmed) {
      window.location.replace('/');
    }
  });
};
